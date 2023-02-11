#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

/**
 * Rogue Legacy Save Editor is a tool for viewing and modifying game saves from Rogue Legacy 1 & 2.
 * Copyright (C) 2023 Travis Lane (Tormak)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>
 */

use std::fs::{File, OpenOptions};
use std::path::Path;
use std::io::prelude::*;
use chrono::prelude::*;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn log_to_file(message: String, level:u8, log_path:String) {
  let mut log_file:File;

  let exists:bool = Path::new(&log_path).exists();

  if exists {
    log_file = File::create(log_path).expect("Encountered an issue when creating the log file.");
  } else {
    log_file = OpenOptions::new()
      .write(true)
      .append(true)
      .open(log_path)
      .unwrap();
  }
  
  let level_name = if level == 0 {"INFO"} else if level == 1 {"WARNING"} else {"ERROR"};

  let now: DateTime<Local> = Local::now();
  let hour = now.hour();
  let min = now.minute();
  let sec = now.second();

  if let Err(e) = writeln!(log_file, "[Rogue Legacy Editor] [{hour}:{min}:{sec}] [{level_name}]: {message}") {
    eprintln!("Couldn't write to file: {}", e);
  }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_persisted_scope::init())
        .invoke_handler(tauri::generate_handler![log_to_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
