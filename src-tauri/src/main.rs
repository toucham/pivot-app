#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use std::path::Path;
use tauri::api::path::local_data_dir;
use tauri::Manager;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

extern crate r2d2;
extern crate r2d2_sqlite;
extern crate rusqlite;

use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::params;

pub struct DBPoolConnect(r2d2::Pool<SqliteConnectionManager>);

mod activity;
mod dashboard;

const DB_FILE_NAME: &str = "pivot_focus.db";

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            // set up dev tool for dev env
            #[cfg(debug_assertions)]
            {
                window.open_devtools();
            }

            // set up transparency background
            #[cfg(target_os = "macos")]
            let radius = 12.0_f64;
            apply_vibrancy(
                &window,
                NSVisualEffectMaterial::HudWindow,
                None,
                Some(radius),
            )
            .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125))).expect(
                "Unsupported platform! 'apply_blur' is only supported on Windows",
            );

            // set up embedded database connection pool

            #[cfg(debug_assertions)]
            let manager = SqliteConnectionManager::file(DB_FILE_NAME);

            #[cfg(not(debug_assertions))]
            {
                let path = Path::new(&local_data_dir().unwrap()).join(DB_FILE_NAME);
                let manager = SqliteConnectionManager::file(path);
            }

            let pool = r2d2::Pool::builder().max_size(5).build(manager).unwrap();

            // setup db table
            match pool.get() {
                Ok(db) => {
                    // create activity table
                    if let Err(e) = db.execute(
                        "CREATE TABLE IF NOT EXISTS activity(
                        id INTEGER PRIMARY KEY,
                        name VARCHAR(30) NOT NULL,
                        desc TEXT,
                        icon INTEGER,
                        rank INTEGER UNIQUE)",
                        params![],
                    ) {
                        println!("Error at creating activity table:\n {:?}", e);
                    } else {
                        // creating timer table
                        if let Err(e) = db.execute(
                            "CREATE TABLE IF NOT EXISTS timer(
                                activity_id INTEGER,
                                start_date TEXT NOT NULL UNIQUE,
                                end_date TEXT NOT NULL,
                                FOREIGN KEY(activity_id) REFERENCES activity(id) ON DELETE CASCADE
                            )",
                            params![],
                        ) {
                            println!("Error at creating timer table: ${:?}", e);
                        }
                        // create progress table
                        if let Err(e) = db.execute(
                            "CREATE TABLE IF NOT EXISTS progress(
                                activity_id INTEGER UNIQUE,
                                time_ms INTEGER,
                                type INTEGER CHECK(type IN (0, 1)),
                                FOREIGN KEY(activity_id) REFERENCES activity(id) ON DELETE CASCADE
                            )",
                            params![],
                        ) {
                            println!("Error at creating progres table:\n {:?}", e);
                        }
                    }
                }
                Err(e) => {
                    println!("Error at getting from pool:\n {:?}", e);
                }
            }

            app.manage(DBPoolConnect(pool));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            activity::save_activity,
            activity::query_activity,
            activity::create_activity,
            dashboard::get_activities,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
