use super::{
    apply_blur, apply_vibrancy, ActivityJson, NSVisualEffectMaterial, Progress,
    ProgressEnum,
};
use chrono::{NaiveDate, Utc};
use rusqlite::params;
use tauri::{utils::config::WindowConfig, State};

/// Create new activity according to the args sent from the frontend
#[tauri::command(rename_all = "snake_case")]
pub async fn create_activity(
    pool_state: State<'_, super::DBPoolConnect>,
    new_act: ActivityJson,
) -> Result<(), &'static str> {
    // TODO: delete this
    println!("invoking create_activity");
    match pool_state.0.get() {
        Ok(db) => {
            if let Err(e) = db.execute(
                "INSERT INTO
                 activity(id, name, rank, icon, time_ms, last_updated)
                 VALUES (?1, ?2, ?3, ?4, 0, date('now'))",
                params![new_act.id, new_act.name, new_act.rank, new_act.icon],
            ) {
                println!("{:?}", e);
                return Err("Error creating a new activity");
            }

            if let Some(prog) = new_act.progress {
                let prog_enum = match prog.t {
                    ProgressEnum::Goal => 0,
                    ProgressEnum::Limit => 1,
                    _ => 2,
                };
                if prog_enum > 1 {
                    return Err("Error at receiving progress type");
                }
                if let Err(e) = db.execute(
                    "INSERT INTO progress(activity_id, type, time_ms)
                    VALUES (?1, ?2, ?3)",
                    params![new_act.id, prog_enum, prog.time_ms],
                ) {
                    println!("{:?}", e);
                    return Err("Error at creating progress for an activity");
                }
            }
        }
        Err(e) => {
            println!("{:?}", e);
            return Err("Error at getting a connection from pool");
        }
    }
    Ok(())
}

/// Update the time_ms in activity table of the row
#[tauri::command]
pub async fn update_activity_time(
    pool_state: State<'_, super::DBPoolConnect>,
    time_ms: u64,
    id: u64,
) -> Result<(), &'static str> {
    // TODO: delete this
    println!("invoking update_activity_time");

    match pool_state.0.get() {
        Ok(db) => {
            if let Err(e) = db.execute(
                "UPDATE activity
                SET time_ms = ?2, last_updated=date('now')
                WHERE id = ?1",
                params![id, time_ms],
            ) {
                println!("{:?}", e);
                return Err("Error updating a row in activity table");
            }
            Ok(())
        }
        Err(e) => {
            println!("{:?}", e);
            Err("Error getting a connection from the pool")
        }
    }
}

/// Load the activities from the save files located at LOCAL_DATA, provided by tauri,
/// to be display on the activity page
#[tauri::command]
pub async fn query_activity(
    pool_state: State<'_, super::DBPoolConnect>,
) -> Result<Vec<ActivityJson>, &'static str> {
    // TODO: remove this
    println!("invoking query_activity");
    // query activities
    match pool_state.0.get() {
        Ok(db) => {
            let mut stm = db
                .prepare(
                    "SELECT a.id, a.name, a.desc, a.icon, a.rank, a.time_ms, 
                        a.last_updated, p.time_ms, p.type
                    FROM activity as a
                    LEFT JOIN progress as p ON p.activity_id = a.id",
                )
                .unwrap();
            let queried_activities: Vec<ActivityJson> = stm
                .query_map([], |rows| {
                    // TODO: check for better error handling => less verbose
                    let mut prog: Option<Progress> = None;
                    if let Ok(time_ms) = rows.get::<usize, u64>(7) {
                        prog = Some(Progress {
                            time_ms,
                            t: match rows.get::<usize, u64>(8).unwrap() {
                                0 => ProgressEnum::Limit,
                                1 => ProgressEnum::Goal,
                                _ => ProgressEnum::Error,
                            },
                        });
                    }

                    // get time_ms
                    let last_updated = rows.get::<usize, String>(6).unwrap();
                    let mut time_ms = 0;
                    let today_date = Utc::now().date_naive();
                    let date_updated = NaiveDate::parse_from_str(
                        last_updated.as_str(),
                        "%Y-%m-%d",
                    )
                    .unwrap_or(today_date);
                    // if last_updated is today then time_ms from sql is usable
                    if date_updated.eq(&today_date) {
                        time_ms = rows.get::<usize, u64>(5).unwrap();
                    }
                    let a = ActivityJson {
                        id: rows.get(0).unwrap(),
                        name: rows.get(1).unwrap(),
                        desc: Some(rows.get(2).unwrap_or(String::from(""))),
                        icon: rows.get(3).unwrap_or(0),
                        rank: rows.get(4).unwrap(),
                        progress: prog,
                        time_ms,
                    };
                    Ok(a)
                })
                .unwrap()
                .into_iter()
                .filter_map(|f| f.ok())
                .collect();
            Ok(queried_activities)
        }
        Err(e) => {
            println!(
                "Error at query activities, getting connection pool: {:?}",
                e
            );
            Err("Error at getting connection pool")
        }
    }
}

#[tauri::command]
pub fn new_window(handle: tauri::AppHandle) -> Result<(), &'static str> {
    println!("opening new window");
    let window_config = WindowConfig {
        label: "new_window".into(),
        url: tauri::WindowUrl::App("/new".into()),
        resizable: false,
        title: "New Activity".into(),
        max_height: Some(300.0),
        max_width: Some(400.0),
        ..handle.config().tauri.windows.get(0).unwrap().clone()
    };
    match tauri::WindowBuilder::from_config(&handle, window_config).build() {
        Ok(window) => {
            // set up transparency background
            #[cfg(target_os = "macos")]
            let radius = 12.0_f64;
            apply_vibrancy(
                    &window,
                    NSVisualEffectMaterial::HudWindow,
                    None,
                    Some(radius),
                )
                    .expect(
                        "Unsupported platform! 'apply_vibrancy' is only supported on macOS",
                    );

            #[cfg(target_os = "windows")]
                apply_blur(&window, Some((18, 18, 18, 125))).expect(
                    "Unsupported platform! 'apply_blur' is only supported on Windows",
                );

            // set up dev tool for dev env
            #[cfg(debug_assertions)]
            {
                window.open_devtools();
            }
        }
        Err(e) => {
            println!("{:?}", e);
            return Err("Error at creating new window for new activity page");
        }
    }

    Ok(())
}
