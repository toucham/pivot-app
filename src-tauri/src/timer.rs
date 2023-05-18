use crate::ActivityTimerJson;
use rusqlite::params;
use tauri::State;

/// Save the activity time after the user clicked stop (not pause) on the app
#[tauri::command]
pub async fn create_timer(
    pool_state: State<'_, super::DBPoolConnect>,
    act: ActivityTimerJson,
) -> Result<(), &'static str> {
    // TODO: delete this
    println!("invoking create_timer");

    match pool_state.0.get() {
        Ok(db) => {
            if let Err(e) = db.execute(
                "INSERT INTO timer(activity_id, start_date, end_date)
                VALUES (?1, ?2, ?3)",
                params![act.id, act.timer.start_date, act.timer.end_date],
            ) {
                println!("{:?}", e);
                return Err("Error inserting row into timer table");
            };
        }
        Err(e) => {
            println!("{:?}", e);
            return Err("Error getting db connection from the pool");
        }
    }

    Ok(())
}
