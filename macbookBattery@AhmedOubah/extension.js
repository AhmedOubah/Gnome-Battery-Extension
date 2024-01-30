


const St = imports.gi.St;

const Main = imports.ui.main;

const Mainloop = imports.mainloop;

const Panel = imports.ui.main.panel;

const GLib = imports.gi.GLib;


let origIndicator,panelButton, panelButtonText, timeout;

let aggregateMenu = Panel.statusArea['aggregateMenu'];


function getBatteryPercentage() {
    try {
        let [success, stdout, stderr] = GLib.spawn_command_line_sync('acpi');
        if (success) {
            let output = stdout.toString().trim();
            let batteryInfo = output.split(':')[1].trim();
            let batteryPercentage = batteryInfo.split(',')[1].trim();
            return batteryPercentage;
        } else {
            logError('Failed to execute acpi command: ' + stderr);
            return 'N/A'; // Return 'N/A' if there's an error
        }
    } catch (e) {
        logError('Exception while executing acpi command: ' + e);
        return 'N/A'; // Return 'N/A' if there's an exception
    }
}

function setButtonText() {

    let batteryPercentage = getBatteryPercentage();
    
    panelButtonText.set_text(batteryPercentage.toString())
    
    return true;
}

function init() {
	    
	panelButton = new St.Bin({ });    
	panelButtonText = new St.Label({ text: "NA"});
	panelButton.set_child(panelButtonText);

}

function enable() {

        timeout = Mainloop.timeout_add_seconds(5.0, setButtonText)
	origIndicator = aggregateMenu._power;
	aggregateMenu._indicators.replace_child(origIndicator, panelButton);
	
}

function disable() {

	aggregateMenu._indicators.replace_child(this, origIndicator);
	Mainloop.source_remove(timeout);    
	aggregateMenu._indicators.replace_child(panelButton,origIndicator);

}

