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
  import { fs } from "@tauri-apps/api";
  import { onMount } from "svelte";
  import Button from "../../components/interactable/Button.svelte";
  import Pane from "../../components/layout/Pane.svelte";
  import BackupEntry from "./BackupEntry.svelte";
  import Titlebar from "../../components/Titlebar.svelte";
  import { AppController } from "../../lib/controllers/AppController";
  import { seriesEntry, showingBackup } from "../../Stores";

  function close() {
    AppController.hideBackupWindow();
  }

  let backups = [];

  onMount(async () => {
    showingBackup.subscribe(async (val) => {
      if (val) {
        backups = [];

        const backupConts = await fs.readDir(
          AppController.backupsController.getBackupDir()
        );

        for (let i = 0; i < backupConts.length; i++) {
          const backupFile = backupConts[i];

          backups.push(backupFile);
        }
      }

      backups = [...backups];
    });
  });
</script>

<main>
  <Titlebar title="Choose a backup to recover" />
  <div class="content">
    <Pane title={"Choose a backup to recover"} width={"calc(100% - 42px)"} height={"calc(100% - 48px)"}>
      <div class="backups-cont">
        {#if backups.length > 0}
          {#each backups as backup}
            <BackupEntry backupFile={backup} />
          {/each}
        {:else}
          <div style="text-align: center;">No backups detected for Rogue Legacy {$seriesEntry + 1}</div>
        {/if}
      </div>
      <div class="buttons">
        <Button text={"Cancel"} onClick={close} width={"100%"} />
      </div>
    </Pane>
  </div>
</main>

<style>
  @import "/theme.css";

  main {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    color: var(--font-color);
  }

  .content {
    z-index: 1;
    margin-top: 5px;
    width: 100%;
    height: calc(100% - 35px);

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .backups-cont {
    background-color: var(--background);

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    padding-top: 7px;

    height: calc(100% - 40px);
  }

  .buttons {
    margin-top: 14px;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
</style>
