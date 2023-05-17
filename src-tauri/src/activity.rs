use rusqlite::params;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tauri::State;

#[derive(Debug, Deserialize, Serialize)]
pub struct ActivityJson {
    // TODO: change to [u8] for optimization
    id: u64, // id is based of JS Date
    name: String,
    desc: String,
    icon: u64,                  // an icon is expressed in 1 byte
    rank: u8,                   // order rank in activity page
    progress: Option<Progress>, // for showing Progress
    timer: Option<Timer>,
}

#[derive(Debug, Deserialize, Serialize)]
struct Progress {
    t: ProgressEnum,
    time_ms: u64,
}

#[derive(Debug, Deserialize, Serialize)]
enum ProgressEnum {
    Goal = 0,
    Limit = 1,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Timer {
    start_date: String,
    end_date: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ActivityTimer {
    timer: Timer,
    id: u64,
}

/// Create new activity according to the args sent from the frontend
#[tauri::command]
pub async fn create_activity(
    pool: State<'_, super::DBPoolConnect>,
    new_act: ActivityJson,
) -> Result<(), &'static str> {
    if let Ok(db) = pool.0.get() {
        // execute a sql transaction
    } else {
        return Err("Error retrieving a db connection from the pool");
    }

    Ok(())
}

/// Save the activity time after the user clicked stop (not pause) on the app
#[tauri::command]
pub fn save_activity(act: ActivityTimer) -> Result<(), &'static str> {
    Ok(())
}

/// Load the activities from the save files located at LOCAL_DATA, provided by tauri,
/// to be display on the activity page
#[tauri::command]
pub fn query_activity(
    pool_state: State<'_, super::DBPoolConnect>,
) -> Result<Vec<ActivityJson>, &'static str> {
    println!("invoking query_activity");
    let mut acts = vec![];
    // query activities
    match pool_state.0.get() {
        Ok(db) => {
            let mut stm_time = db
                .prepare(
                    "SELECT DISTINCT 
                    activity_id, MAX(start_date), end_date from timer
                    where date(start_date, 'start of day')=date('now', 'start of day') 
                    group by activity_id",
                )
                .unwrap();
            let mut timer: HashMap<u64, Timer> = stm_time
                .query_map([], |rows| {
                    let t = Timer {
                        start_date: rows.get(1).unwrap(),
                        end_date: rows.get(2).unwrap(),
                    };
                    Ok((rows.get(0).unwrap(), t))
                })
                .unwrap()
                .into_iter()
                .filter_map(|f| f.ok())
                .map(|f| (f.0, f.1))
                .collect();
            let mut stm = db
                .prepare(
                    "SELECT * FROM activity 
                    LEFT JOIN progress 
                    ON progress.activity_id = activity.id",
                )
                .unwrap();
            acts.extend(
                stm.query_map([], |rows| {
                    // TODO: check for better error handling => less verbose
                    let mut prog: Option<Progress> = None;
                    if let Ok(time_ms) = rows.get::<usize, u64>(6) {
                        prog = Some(Progress {
                            time_ms,
                            t: match rows.get(7).unwrap() {
                                0 => ProgressEnum::Limit,
                                _ => ProgressEnum::Goal,
                            },
                        });
                    }
                    let id = rows.get(0).unwrap();
                    let a = ActivityJson {
                        id,
                        name: rows.get(1).unwrap(),
                        desc: rows.get(2).unwrap_or(String::from("")),
                        icon: rows.get(3).unwrap_or(0),
                        rank: rows.get(4).unwrap(),
                        progress: prog,
                        timer: timer.remove(&id),
                    };
                    Ok(a)
                })
                .unwrap()
                .into_iter()
                .filter_map(|f| f.ok())
                .collect::<Vec<_>>(),
            );
        }
        Err(e) => {
            println!(
                "Error at query activities, getting connection pool: {:?}",
                e
            );
        }
    };
    Ok(acts)
}
