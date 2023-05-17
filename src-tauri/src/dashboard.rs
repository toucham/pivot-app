use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct ActivityJson {}

#[tauri::command]
pub fn get_activities(
    range: (u64, u64),
    filter: Option<ActivityJson>,
) -> Result<(), &'static str> {
    Ok(())
}
