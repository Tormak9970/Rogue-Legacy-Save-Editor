<!--
 Rogue Legacy Save Editor is a tool for viewing and modifying game saves from Rogue Legacy 1 & 2.
 Copyright (C) 2023 Travis Lane (Tormak)
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with this program. If not, see <https://www.gnu.org/licenses/>
 -->
<script lang="ts">
  import type { FileEntry } from "@tauri-apps/api/fs";
  import { onMount } from "svelte";
  import { AppController } from "../../lib/controllers/AppController";
  import Button from "../../components/interactable/Button.svelte";
  import Pane from "../../components/layout/Pane.svelte";

  export let backupFile: FileEntry;

  const months = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let date = "";
  let time = "";
  let profile = "";

  function close() {
    AppController.hideBackupWindow();
  }

  async function restore() {
    await AppController.backupsController.loadBackup(backupFile.path);
    close();
  }

  onMount(() => {
    const saveData = AppController.backupsController.deconstructSave(
      backupFile.name
    );
    date = `${months[saveData.month]} ${saveData.day}, ${saveData.year}`;

    const isPm = saveData.hours / 12 > 1;

    time = `${saveData.hours % 12}:${
      saveData.minutes < 10 ? `0${saveData.minutes}` : saveData.minutes
    } ${isPm ? "pm" : "am"}`;
    profile = saveData.saveSlot;
  });
</script>

<div class="backup-entry">
  <Pane padding={"7px"} width={"calc(100% - 30px)"} margin={"0px 7px 7px 7px"}>
    <div class="content">
      <div class="backup-info">{date} at {time} - {profile}</div>
      <div class="actions">
        <Button text={"Restore"} onClick={restore} width={"60px"} />
      </div>
    </div>
  </Pane>
</div>

<style>
  @import "/theme.css";

  .backup-entry {
    min-width: 400px;
  }

  .content {
    width: calc(100% - 2px);

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .backup-info {
    font-size: 12px;
  }
</style>
