use rusqlite::{params, Connection, Result};
use tauri::AppHandle;
use serde::{Serialize, Deserialize};
use std::fs;
use tauri::Manager;

#[derive(Serialize, Deserialize, Debug)]
pub struct Event {
    pub id: i64,
    pub title: String,
    pub description: Option<String>,
    pub start_time: String,
    pub end_time: String,
}

pub fn init_db(app_handle: &AppHandle) -> Result<()> {
    let app_dir = app_handle.path().app_data_dir().expect("failed to get app data dir");
    if !app_dir.exists() {
        fs::create_dir_all(&app_dir).expect("failed to create app data dir");
    }
    let db_path = app_dir.join("calendar.db");
    let conn = Connection::open(db_path)?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )?;
    Ok(())
}

fn get_connection(app_handle: &AppHandle) -> Result<Connection> {
    let app_dir = app_handle.path().app_data_dir().expect("failed to get app data dir");
    let db_path = app_dir.join("calendar.db");
    Connection::open(db_path)
}

pub fn get_events(app_handle: &AppHandle, start_range: String, end_range: String) -> Result<Vec<Event>> {
    let conn = get_connection(app_handle)?;
    let mut stmt = conn.prepare("SELECT id, title, description, start_time, end_time FROM events WHERE start_time >= ?1 AND start_time <= ?2 ORDER BY start_time ASC")?;
    
    let event_iter = stmt.query_map(params![start_range, end_range], |row| {
        Ok(Event {
            id: row.get(0)?,
            title: row.get(1)?,
            description: row.get(2)?,
            start_time: row.get(3)?,
            end_time: row.get(4)?,
        })
    })?;

    let mut events = Vec::new();
    for event in event_iter {
        events.push(event?);
    }
    Ok(events)
}

pub fn create_event(app_handle: &AppHandle, title: String, description: Option<String>, start: String, end: String) -> Result<i64> {
    let conn = get_connection(app_handle)?;
    conn.execute(
        "INSERT INTO events (title, description, start_time, end_time) VALUES (?1, ?2, ?3, ?4)",
        params![title, description, start, end],
    )?;

pub fn get_upcoming_events(app_handle: &AppHandle, start_range: String, end_range: String) -> Result<Vec<Event>> {
    let conn = get_connection(app_handle)?;
    let mut stmt = conn.prepare("SELECT id, title, description, start_time, end_time FROM events WHERE start_time >= ?1 AND start_time <= ?2")?;
    
    let event_iter = stmt.query_map(params![start_range, end_range], |row| {
        Ok(Event {
            id: row.get(0)?,
            title: row.get(1)?,
            description: row.get(2)?,
            start_time: row.get(3)?,
            end_time: row.get(4)?,
        })
    })?;

    let mut events = Vec::new();
    for event in event_iter {
        events.push(event?);
    }
    Ok(events)
}

    let conn = get_connection(app_handle)?;
    conn.execute("DELETE FROM events WHERE id = ?1", params![id])?;
    Ok(())
}
