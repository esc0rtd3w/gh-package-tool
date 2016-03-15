// ==UserScript==
// @name        Gamehouse Package Tool
// @namespace   com.crypticware.ghpkgtool
// @description Parses Content ID from page to create a direct download link to package
// @include     http://www.gamehouse.com/download-games/*
// @version     1
// @grant       none
// ==/UserScript==



// Part of the RealArcade Wrapper Killer
// cRypTiCwaRe 2016



// This is a side project of mine.
// I am in no way a Javascript programmer, but more of a curious hacker ;)

// I have been involved with hacking, reverse-engineering, and collecting data from RealArcade, and now GameHouse since 2005.

// My code is probably shit, so do not laugh!!!





// Basic Info and Text
var scriptVer = "0.2.0";
var scriptTitle = "GH Package Download Tool " + "v" + scriptVer + "\n\n\n";
var scriptCredits = "\n\n\nesc0rtd3w / cRypTiCwaRe 2016";



// Sample URLs

// EXE Stub (RFS)
// http://installer-manager.gamehouse.com/InstallerManager/getinstaller?filename=f86bc49a788ace0058a420899e086139-supergloveshero.rfs&offering=supergloveshero&channel=z_syn_gh_g12

// EXE Stub (RGA With Lang)
// http://installer-manager.gamehouse.com/InstallerManager/getinstaller?filename=reaxxion_EN.rga&offering=dip_nt_zy_en&channel=z_syn_gh_g12

// EXE Stub (RGA No Lang)
// http://installer-manager.gamehouse.com/InstallerManager/getinstaller?filename=MONOPOLY.rga&offering=dip_nt_zy_en&channel=z_syn_gh_g12


// RFS
// http://games-dl.gamehouse.com/zylom/ghmigration/supergloveshero/f86bc49a788ace0058a420899e086139-supergloveshero.rfs

// RGA (With Lang)
// http://games-dl.gamehouse.com/zylom/popcap/dip_nt_zy_en/MONOPOLY.rga

// RGA (No Lang)
// http://games-dl.gamehouse.com/zylom/mumbo/dip_nt_zy_en/supergloveshero_EN.rga


// Set URL Bases For Different Game Types
var baseExeStub = "http://installer-manager.gamehouse.com/InstallerManager/getinstaller?filename=";
var basePopcap = "http://games-dl.gamehouse.com/zylom/popcap/dip_nt_zy_en";
var baseZylomGHM = "http://games-dl.gamehouse.com/zylom/ghmigration/";
var baseZylomMumboDipEN = "http://games-dl.gamehouse.com/zylom/mumbo/dip_nt_zy_en/";


// Set Default Game Info Values
var base = baseZylomGHM;
var gameNameTitle = "Game Name Title Here";
var gameNameWebpage = "game-name-here";
var gameNamePackage = "gamenamehere";
var cid = "00000000000000000000000000000000";
var ext = "rfs";
var lang = "_EN";
var offering = "dip_nt_zy_en";
var channel = "z_syn_gh_g12";

var gameTitle = "";
var gameInfo = "";


// Set Default Link Variables
var linkEXE = "";
var linkRGA = "";
var linkRGS = "";
var linkRFS = "";


// Scroll To Bottom of Page
function scrollToBottom(height){
	window.scrollTo(0,document.body.scrollHeight);
}


// Get Content ID
function getCID(){
	// Get 32 Chars Directly Between the Equal Sign "=" and The Next Ampersand "&" From Page Source
	// Example: gamesetid=6000&contentid=6a95810f4bde20ec4b280aa125cbd491&licensetype=2
	var cidTemp = document.documentElement.innerHTML.split('contentid=');
	for(x=0; x<cidTemp.length; x++){
		if(/\d+&/i.test(cidTemp[x])){
			cid = cidTemp[x].split('&')[0];
		}
	}
}

// Get Game Name
function getGameName(){
	// Get Game Name From Title (Same as Install Directory Name)
	gameNameTitleTemp = document.getElementsByTagName("title")[0].innerHTML;

	// Trim " | Gamehouse" From End of Title
	gameNameTitle = gameNameTitleTemp.slice(0, -12);

	// Get Game Web Page Link String (With Dashes)
	gameNameWebpage = window.location.href.substring(40);

	// Get Game Direct Package Link String (Without Dashes)
	gameNamePackage = gameNameWebpage.split('-').join('');
}
	

// Build Game Info
//gameTitle = gameNameTitle + "\n\n\n";
//gameInfo = "Game Name (Directory Title): " + gameNameTitle + "\n\n" + "Game Name (Web Info): " + gameNameWebpage + "\n\n" + "Game Name (Package Link): " + gameNamePackage + "\n\n" + "Content ID: " + cid + "\n\n";

	
// Build New Download Links
function buildNewLinks(){
	// Post Download Page
	// http://www.gamehouse.com/pc/postdownload/


	// EXE Stub
	// Sample #1
	// http://installer-manager.gamehouse.com/InstallerManager/getinstaller?filename=8a1c173c8e00ac970f70a78261a15469-incredibledraculachasinglovepe.rfs&offering=incredibledraculachasinglovepe&channel=z_syn_gh_g12
	base = baseExeStub;
	offering = gameNamePackage;
	linkEXE = base + cid + "-" + gameNamePackage + "." + ext + "&offering=" + offering + "&channel=" + channel;

	// RFS
	base = baseZylomGHM;
	ext = "rfs";
	linkRFS = base + gameNamePackage + "/" + cid + "-" + gameNamePackage + "." + ext;

	// RGA
	base = baseZylomMumboDipEN;
	ext = "rga";
	linkRGA = base + gameNamePackage + lang + "." + ext;
}

// Do The Dirty Work
getCID();
getGameName();
buildNewLinks();


//popupInfo = scriptTitle + gameInfo + linkRFS + "\n\n" + linkRGA + scriptCredits;
//var popupInfo = scriptTitle + gameTitle + linkEXE + "\n\n" + linkRFS + "\n\n" + linkRGA + scriptCredits;


// Popup Game and Package Info
//alert(popupInfo);


// Show an Alert Message To User
alert(scriptTitle + "\n\nCheck The Bottom of Page For Buttons With Direct Links\n\n" + scriptCredits);



// Create Buttons
var newDiv = document.createElement('div');
newDiv.innerHTML = '<button id="btnEXE" type="button">'
                + 'Download EXE Stub</button>'
				+ '<button id="btnRGA" type="button">'
				+ 'Download RGA File</button>'
				+ '<button id="btnRGS" type="button">'
				+ 'Download RGS File</button>'
				+ '<button id="btnRFS" type="button">'
				+ 'Download RFS File</button>'
                ;
				
// Append Buttons
newDiv.setAttribute('id', 'modContainer');
document.body.appendChild(newDiv);

// Scroll To Bottom of Page To See Buttons
scrollToBottom();

// Add Button Listeners
document.getElementById("btnEXE").addEventListener(
    "click", btnActionEXE, false
);

document.getElementById("btnRGA").addEventListener(
    "click", btnActionRGA, false
);

document.getElementById("btnRGS").addEventListener(
    "click", btnActionRGS, false
);

document.getElementById("btnRFS").addEventListener(
    "click", btnActionRFS, false
);


// Add Button Actions
function btnActionEXE(action){
	window.open(linkEXE,"_self");
}

function btnActionRGA(action){
	window.open(linkRGA,"_self");
}

function btnActionRGS(action){
	window.open(linkRGS,"_self");
}

function btnActionRFS(action){
	window.open(linkRFS,"_self");
}


// Greasemonkey Style CSS
// Original Source: http://stackoverflow.com/questions/6480082/add-a-javascript-button-using-greasemonkey-or-tampermonkey
GM_addStyle ( cleanCSS ( function () {/*!
    #modContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              20px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                222;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #modContainer p {
        color:                  red;
        background:             white;
    }
*/} ) );

function cleanCSS(dummyFunc){
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') // Strip function () { /*!
            .replace (/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
            .replace (/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
            ;
    return str;
}


