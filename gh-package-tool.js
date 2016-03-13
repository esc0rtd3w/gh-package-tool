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
var scriptVer = "0.1.7";
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


// Set Default Values
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

var linkEXE = "";
var linkRFS = "";
var linkRGA = "";


// Get Content ID
var cidTemp = document.documentElement.innerHTML.split('contentid=');
for(x=0; x<cidTemp.length; x++){
	if(/\d+&/i.test(cidTemp[x])){
		cid = cidTemp[x].split('&')[0];
	}
}

// Get Game Name From Title (Same as Install Directory Name)
gameNameTitleTemp = document.getElementsByTagName("title")[0].innerHTML;

// Trim " | Gamehouse" From End of Title
gameNameTitle = gameNameTitleTemp.slice(0, -12);

// Get Game Web Page Link String (With Dashes)
gameNameWebpage = window.location.href.substring(40);

// Get Game Direct Package Link String (Without Dashes)
gameNamePackage = gameNameWebpage.split('-').join('');
	

// Build Game Info
gameTitle = gameNameTitle + "\n\n\n";
gameInfo = "Game Name (Directory Title): " + gameNameTitle + "\n\n" + "Game Name (Web Info): " + gameNameWebpage + "\n\n" + "Game Name (Package Link): " + gameNamePackage + "\n\n" + "Content ID: " + cid + "\n\n";

	
// Build New Download Links

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





//popupInfo = scriptTitle + gameInfo + linkRFS + "\n\n" + linkRGA + scriptCredits;
var popupInfo = scriptTitle + gameTitle + linkEXE + "\n\n" + linkRFS + "\n\n" + linkRGA + scriptCredits;


// Popup Game and Package Info
alert(popupInfo);



// This crap does not work yet below!!!

//var btn = document.createElement("BUTTON");
//document.body.appendChild(btn);

//var ghHook = document.getElementById('div');
//var ghFirstChild = ghHook.firstChild;
//var ghPackageTool = document.createElement("div");
//ghHook.insertBefore(ghPackageTool, ghFirstChild);


// Create Buttons
var btnEXE = document.createElement("BUTTON");
var btnRGA = document.createElement("BUTTON");
var btnRGS = document.createElement("BUTTON");
var btnRFS = document.createElement("BUTTON");

// Create Button Text
var btnTextEXE = document.createTextNode("Download EXE Stub");
var btnTextRGA = document.createTextNode("Download RGA File");
var btnTextRGS = document.createTextNode("Download RGS File");
var btnTextRFS = document.createTextNode("Download RFS File");

// Append Crap
btnEXE.appendChild(btnTextEXE);
btnRGA.appendChild(btnTextRGA);
btnRGS.appendChild(btnTextRGS);
btnRFS.appendChild(btnTextRFS);

document.body.appendChild(btnEXE);
document.body.appendChild(btnRGA);
document.body.appendChild(btnRGS);
document.body.appendChild(btnRFS);
