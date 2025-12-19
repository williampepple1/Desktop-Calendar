use tauri::{Builder, command, AppHandle, Manager};
use std::thread;
use std::time::Duration;
use chrono::{Utc, TimeZone};
mod db;
use tauri_plugin_notification::NotificationExt;

#[command]
fn get_events(app: AppHandle, start_range: String, end_range: String) -> Result<Vec<db::Event>, String> {
    db::get_events(&app, start_range, end_range).map_err(|e| e.to_string())
}

#[command]
fn create_event(app: AppHandle, title: String, description: Option<String>, start: String, end: String) -> Result<i64, String> {
    db::create_event(&app, title, description, start, end).map_err(|e| e.to_string())
}

#[command]
fn delete_event(app: AppHandle, id: i64) -> Result<(), String> {
    db::delete_event(&app, id).map_err(|e| e.to_string())
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  Builder::default()
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_notification::init())
    .setup(|app| {
        db::init_db(app.handle()).expect("failed to init db");
        
        let handle = app.handle().clone();
        thread::spawn(move || {
            loop {
                thread::sleep(Duration::from_secs(60));
                
                let now = Utc::now();
                let now_str = now.to_rfc3339();
                let five_min_later = now + chrono::Duration::minutes(5);
                let later_str = five_min_later.to_rfc3339();

                if let Ok(events) = db::get_upcoming_events(&handle, now_str, later_str) {
                    for event in events {
                        let _ = handle.notification()
                            .builder()
                            .title("Upcoming Event")
                            .body(&format!("{} is starting soon!", event.title))
                            .show();
                    }
                }
            }
        });

        Ok(())
    })
    })
    .invoke_handler(tauri::generate_handler![get_events, create_event, delete_event])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
