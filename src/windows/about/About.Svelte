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
  import Button from "../../components/interactable/Button.svelte";
  import Pane from "../../components/layout/Pane.svelte";
  import Titlebar from "../../components/Titlebar.svelte";
  import { AppController } from "../../lib/controllers/AppController";

  function openLink(link: string) {
    open(link);
  }

  function closeFunc() {
    AppController.hideAboutWindow();
  }
</script>

<main>
  <Titlebar title="About" />
  <div class="content">
    <Pane width={"calc(100% - 34px)"}>
      <div class="header">
          About
      </div>
      <div class="message">
          Rogue Legacy Save Editor is a tool for viewing and modifying game saves from Rogue Legacy 1 & 2
      </div>
      <div class="header">
          Licensing
      </div>
      <div class="message">
          Copyright (C) 2023 Travis Lane (Tormak)<br/>
          <br/>
          This program is free software: you can redistribute it and/or modify<br/>
          it under the terms of the GNU General Public License as published by<br/>
          the Free Software Foundation, either version 3 of the License, or<br/>
          (at your option) any later version.<br/>
          <br/>
          This program is distributed in the hope that it will be useful,<br/>
          but WITHOUT ANY WARRANTY; without even the implied warranty of<br/>
          MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the<br/>
          GNU General Public License for more details.<br/>
          <br/>
          You should have received a copy of the GNU General Public License<br/>
          <!-- svelte-ignore a11y-invalid-attribute -->
          along with this program. If not, see <a href="" on:click={() => { openLink("https://www.gnu.org/licenses/")}}>https://www.gnu.org/licenses/</a>
      </div>
      <div class="buttons">
          <Button text={"Close"} onClick={closeFunc} />
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

  .header {
    text-align: center;
    font-size: 18px;
  }

  .buttons {
    margin-top: 14px;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .message {
    font-size: 12px;
  }

  a {
    color: #58a6ff;
  }

  a:hover {
    color: #85bdfd;
  }
</style>
