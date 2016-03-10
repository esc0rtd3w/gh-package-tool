// ==UserScript==
// @name        Gamehouse Package Tool
// @namespace   com.crypticware.ghpkgtool
// @description Parses Content ID from page to create a direct download link to package
// @include     http://www.gamehouse.com/download-games/*
// @version     1
// @grant       none
// ==/UserScript==




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
var gameNameTitleTemp = "";
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
linkEXE = "Direct Link (EXE Stub):\n" + base + cid + "-" + gameNamePackage + "." + ext + "&offering=" + offering + "&channel=" + channel;

// RFS
base = baseZylomGHM;
ext = "rfs";
linkRFS = "Direct Link (RFS):\n" + base + gameNamePackage + "/" + cid + "-" + gameNamePackage + "." + ext;

// RGA
base = baseZylomMumboDipEN;
ext = "rga";
linkRGA = "Direct Link (RGA):\n" + base + gameNamePackage + lang + "." + ext;





//popupInfo = scriptTitle + gameInfo + linkRFS + "\n\n" + linkRGA + scriptCredits;
var popupInfo = scriptTitle + gameTitle + linkEXE + "\n\n" + linkRFS + "\n\n" + linkRGA + scriptCredits;


// Popup Game and Package Info
alert(popupInfo);

