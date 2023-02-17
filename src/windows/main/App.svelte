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
	import { SvelteToast } from "@zerodevx/svelte-toast";
    import Button from "../../components/interactable/Button.svelte";
    import Pane from "../../components/layout/Pane.svelte";
    import PathField from "../../components/interactable/PathField.svelte";
    import Tabs from "../../components/tabs/Tabs.svelte";
	import Titlebar from "../../components/Titlebar.svelte";
    import { AppController } from "../../lib/controllers/AppController";
    
    import { availableProfiles, discardChangesDisabled, loaderProgress, saveChangesDisabled, saveDirPath, selectedProfile, seriesEntry, showConfirmDiscard, showConfirmReload, showingAbout } from "../../Stores";
    import ProgressBar from "../../components/info/ProgressBar.svelte";
    import ConfirmModal from "../../components/modals/ConfirmModal.svelte";
    import LoadBackupModal from "../../components/modals/LoadBackupModal.svelte";
    import ReloadButton from "../../components/interactable/ReloadButton.svelte";
    import AboutModal from "../../components/modals/AboutModal.svelte";
    import { onDestroy, onMount } from "svelte";
    import { getDefaultSaveDirectory } from "../../lib/utils/Utils";
    import DropDown from "../../components/interactable/DropDown.svelte";

    let defaultSavePath:string = $saveDirPath;

    async function loadSave(e:Event) {
        const path = (e.currentTarget as HTMLInputElement).value;
        AppController.log(`Updated save dir for Rogue Legacy ${$seriesEntry+1} to ${path}`);
        $saveDirPath = path;
    }
    function setProfile(value:string) {
        AppController.log(`Updated selected profile for Rogue Legacy ${$seriesEntry+1} to ${value}`);
        $selectedProfile = value;
    }

    async function confirmReload(e:Event) { $showConfirmReload = true; }

    async function reload() { await AppController.reload(); }

    async function confirmDiscard(e:Event) { $showConfirmDiscard = true; }
    async function discardChanges() { await AppController.discardChanges(); }
    async function saveChanges(e:Event) { await AppController.saveChanges(); }

    async function makeBackup(e:Event) { await AppController.backup(); }
    async function loadBackup(e:Event) { await AppController.loadBackups(); }

    function showAboutModal(e:Event) {
        AppController.showAboutWindow();
    }

    function switchGameVersion(e:Event) { AppController.switchGameVersion(); }

    onMount(async () => {
        if ($saveDirPath == "") {
            defaultSavePath = await getDefaultSaveDirectory($seriesEntry);
        }
    });

    onDestroy(() => AppController.onDestroy());
</script>

<main>
	<Titlebar title="Editor v{__APP_VERSION__} - Editing Rogue Legacy {$seriesEntry + 1}" />
    <ConfirmModal width={"250px"} show={$showConfirmDiscard} message={"Are you sure you want to discard your changes?"} onConfirm={discardChanges} onCancel={async () => { $showConfirmDiscard = false; }} />
    <ConfirmModal width={"300px"} show={$showConfirmReload} message={"Are you sure you want to reload? You will loose your changes."} onConfirm={reload} onCancel={async () => { $showConfirmReload = false; }} />
    <AboutModal show={$showingAbout} />
    <LoadBackupModal />
	<div class="content">
        <Pane title="Paths" width={"calc(100% - 34px)"}>
            <div class="row" style="margin-top: 0px;">
                <PathField fieldName="Save Directory" title={"Select a save directory"} defaultPath={defaultSavePath} cVal={$saveDirPath} handler={loadSave} />
                <div style="height: 1px; width: 7px;" />
                <Button text={"Make Backup"} onClick={makeBackup} width={"100px"} />
            </div>
            <div class="row" style="display:flex; flex-direction:row; justify-content:space-between;">
                <DropDown fieldName="Save Profile" options={$availableProfiles} value={$selectedProfile} handler={setProfile} />
                <div style="height: 1px; width: 7px;" />
                <Button text={"Load Backup"} onClick={loadBackup} width={"100px"} />
            </div>
        </Pane>
        <Pane title="Save Data" fillParent width={"calc(100% - 34px)"}>
            <Tabs />
        </Pane>
        <Pane padding={"7px"} width={"calc(100% - 34px)"}>
            <div class="bottom-wrapper">
                <div class="rights">© Travis Lane 2023</div>
                <div class="bottom-panel">
                    <Button text={"Switch Game Version"} onClick={switchGameVersion} width={"140px"} />
                    <div style="width: 7px; height: 1px;" />
                    <Button text={"About"} onClick={showAboutModal} width={"60px"} />
                    <div style="width: 7px; height: 1px;" />
                    <ReloadButton onClick={confirmReload} />
                    <div style="width: 7px; height: 1px;" />
                    <ProgressBar width={"300px"} progress={$loaderProgress} />
                    <div style="width: 7px; height: 1px;" />
                    <Button text={"Discard Changes"} onClick={confirmDiscard} width={"120px"} disabled={$discardChangesDisabled} />
                    <div style="width: 7px; height: 1px;" />
                    <Button text={"Save Changes"} onClick={saveChanges} width={"100px"} disabled={$saveChangesDisabled} />
                </div>
            </div>
        </Pane>
	</div>
</main>
<SvelteToast />

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

    .row {
        margin-top: 7px;

        display: flex;
        align-items: center;
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

    .bottom-wrapper {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .rights {
        margin-left: 7px;
        font-size: 12px;
        opacity: 0.2;
    }

    .bottom-panel {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }
</style>