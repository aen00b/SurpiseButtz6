//****************************************************************
//
//  Random Notes
//
//  Created by Attila Enhardt on 02/03/2016.
//  Copyright © 2015 CavemanCode. All rights reserved.
//
//*****************************************************************
var PluginParameters = [],
noteMaps = new Array(128),
noteNames = makeNoteNames();
low = 24,
high = 104,
tLow = 60,
tHigh = 95,
onEach = 0,
info = 0;
vers = 'v.1.0',
scriptName = 'Random Notes',
logo = ' |LogicScripts| ';
ResetParameterDefault = false;

Array.prototype.populate = function () {
	for (var i = 0; i < this.length; i++) {
		this[i] = new noteLocal(i, noteNames[i], i);
	}
};
noteMaps.populate();
depot('cp', [scriptName + logo + vers, 'text']);
depot('cp', ['Trigger low ', 'menu', noteNames, 0, 127, tLow, 127, 0, 'tlow']);
depot('cp', ['Trigger high ', 'menu', noteNames, 0, 127, tHigh, 127, 0, 'thigh']);
depot('cp', ['Note limit low ', 'menu', noteNames, 0, 127, low, 127, 0, 'low']);
depot('cp', ['Note limit high ', 'menu', noteNames, 0, 127, high, 127, 0, 'high']);
depot('cp', ['Random on each new note-on? ', 'checkbox', 0, 0, 0, 0, 0,0 ,'oneach']);
depot('cp', ['Randomize & Run ', 'checkbox', 0, 0, 0, 0, 0, 0,'ranrun']);
depot('cp', ['Reset default notes ', 'checkbox', 0, 0, 0, 0, 0, 0,'reset']);
depot('cp', ['Trace notes ?', 'checkbox', 0, 0, 0, 0, 0, 0,'trace']);
function HandleMIDI(e) {
	if (e instanceof Note && e.pitch >= tLow && e.pitch <= tHigh) {
		if(info && e instanceof NoteOn){
			var infoTrace = 'Trigger note ' + noteNames[e.pitch] + ' to output note ';
		}
		switch (true) {
		case (e instanceof NoteOn):
			switch (onEach) {
			case 0:
				e.pitch = noteMaps[e.pitch].out;
				break;
			case 1:
				e.pitch = noteMaps[e.pitch].random(low, high);
				break;
			default:

			}

			break;
		case (e instanceof NoteOff):
			e.pitch = noteMaps[e.pitch].out;
			break;
		default:

		}
		if(info && e instanceof NoteOn){
			infoTrace.concat(noteNames[e.pitch];)
			Trace(infoTrace);
		}
	}
	e.send();
}
function ParameterChanged(par, val) {
	MIDI.allNotesOff();
	switch (PluginParameters[par].pc) {
	case 'tlow':
		tLow = val;
		break;
	case 'thigh':
		tHigh = val;
		break;
	case 'low':
		low = val;
		break;
	case 'high':
		high = val;
		break;
	case 'low':
		low = val;
		break;
	case 'oneach':
		onEach = val;
		break;
	case 'ranrun':
	if(val){
		noteMaps.randomizeMaps(low, high);
		SetParameter(p,0);
	}
		break;
	case 'reset':
	if(val){
		noteMaps.resetMaps();
		SetParameter(p,0);
	}
		break;

	case 'trace':
	info = val;
			break;
	default:

	}
}

Array.prototype.resetMaps = function () {
	for (i = 0; i < this.length; i++) {
		this[i].out = this[i].number;
	}
};
Array.prototype.randomizeMaps = function (l, h) {
	var min = l ? l : 0,
	max = h ? h : this.length - 1;
	for (i = min; i <= max; i++) {
		this[i].out = Math.floor(Math.random() * (max - min + 1)) + min;
	}
};
function noteLocal(no, name, out) {
	this.number = no,
	this.name = name,
	this.out = out,
	this.reset = function () {
		this.out = this.number;
	};
	this.random = function (low, high) {
		var min = low ? low : 0,
		max = high ? high : 127;
		this.out = Math.floor(Math.random() * (max - min + 1)) + min;
		return this.out;
	}
}
function depot(f, args) {
	switch (f) {
	case 'cp':
		args[1] == 'checkbox' ? PluginParameters.push({
			name : args[0],
			type : args[1],
			pc : args[8],
			defaultValue : 0

		}) :
		PluginParameters.push({
			name : args[0],
			type : args[1],
			valueStrings : args[2] ? args[2] : 0,
			minValue : args[3] ? args[3] : 0,
			maxValue : args[4] ? args[4] : 0,
			defaultValue : args[5] ? args[5] : 0,
			numberOfSteps : args[6] ? args[6] : 0,
			unit : args[7],
			pc : args[8]
		});
		break;
	default:

	}
}
function makeNoteNames() {
	var noteNamesArray = [];
	var rootNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	for (var i = 0; i < 128; i++) {
		var octaveName = Math.floor(i / 12) - 2;
		noteNamesArray.push(rootNames[i % 12] + octaveName);
	}
	return noteNamesArray;
}
