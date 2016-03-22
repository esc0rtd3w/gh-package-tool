// ==UserScript==
// @name        Gamehouse Package Tool
// @namespace   com.crypticware.ghpkgtool
// @description Parses Content ID from page to create a direct download links to all the package types
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
var scriptVer = "0.2.4";
var scriptTitle = "GH Package Download Tool " + "v" + scriptVer + "\n\n\n";
var scriptCredits = "\n\n\nesc0rtd3w / cRypTiCwaRe 2016";



// Sample URLs

// EXE Stub
// http://installer-manager.gamehouse.com/InstallerManager/getinstaller?filename=f86bc49a788ace0058a420899e086139-supergloveshero.rfs&offering=supergloveshero&channel=z_syn_gh_g12

// EXE Stub (RGA With Lang)
// http://installer-manager.gamehouse.com/InstallerManager/getinstaller?filename=reaxxion_EN.rga&offering=dip_nt_zy_en&channel=z_syn_gh_g12

// EXE Stub (RGA No Lang)
// http://installer-manager.gamehouse.com/InstallerManager/getinstaller?filename=MONOPOLY.rga&offering=dip_nt_zy_en&channel=z_syn_gh_g12


// RFS
// http://games-dl.gamehouse.com/zylom/ghmigration/supergloveshero/f86bc49a788ace0058a420899e086139-supergloveshero.rfs

// RFS Platinum Edition

// Normal filename using "platinumedition" as the string
// http://games-dl.gamehouse.com/zylom/ghmigration/fantasyquest2platinumedition/bb71c9cc936841399273205d059e405f-fantasyquest2platinumedition.rfs

// Replace "platinumedition" with "pe"
// http://games-dl.gamehouse.com/zylom/ghmigration/sablemazesullivanriverpe/5b8ef99d94b4cc0d4be3b7805188522f-sablemazesullivanriverpe.rfs

// Replace Each word after 32 chars with just the first letter??
// http://games-dl.gamehouse.com/zylom/ghmigration/deathuponanaustriansonataadknpe/af5adab1ea584472a88c2f32b111ec45-deathuponanaustriansonataadknpe.rfs


// RGA (With Lang)
// http://games-dl.gamehouse.com/zylom/popcap/dip_nt_zy_en/MONOPOLY.rga

// RGA (No Lang)
// http://games-dl.gamehouse.com/zylom/mumbo/dip_nt_zy_en/supergloveshero_EN.rga


// Set URL Bases For Different Game Types
var baseExeStub = "http://installer-manager.gamehouse.com/InstallerManager/getinstaller?filename=";
var baseTerminalStudio = "http://games-dl.gamehouse.com/zylom/terminalstudio/dip_nt_zy_en";
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

// Default Hijack Element
var hijackID;
var hijackMe;

// Default Button Elements
var btnPlayNow = "dl_now_button button";
var btnPlayNowElement = document.getElementById("dl_now_button button");
var btnFunpass = "funpass_btn";
var btnFunpassElement = document.getElementById("funpass_btn");

// Special Situations (Platinum, Double Pack, Funpass, etc)
var isPlatinum = "0";
var isDoublePack = "0";



// BEGIN FUNCTIONS --------------------------------------------------------------------/

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



// Check For Platinum Edition
// Main Webpage Link: http://www.gamehouse.com/platinum-games?platform=pc-games
function checkPlatinum(){
	
	// Game Links Tested OK (pe)
	
	// 7-wonders-ancient-alien-makeover-platinum-edition
	// 9-the-dark-side-of-notre-dame-platinum-edition >> 9thedarksideofnotredameplatinumedition
	// lost-lands-the-golden-curse-platinum-edition >> lostlandsthegoldencurseplatinumedition
	// mystery-trackers-four-aces-platinum-edition >> mysterytrackersfouracesplatinumedition
	
	// Game Links Tested OK (1st Letter Only)
	// 12-labours-of-hercules-iv-mother-nature-platinum-edition >> 12laboursofherculesivmnpe
	
	if (gameNameTitle.search("platinumedition") != "platinumedition") {
	   isPlatinum = "1";
	} 
	
	// Check Names if "Platinum Edition"
	if (isPlatinum == "1"){
		//alert("Platinum Edition");
		var fixPlatinum = 'pe'
		
		// Individual Game Name Fixes
		if (gameNamePackage == "12laboursofherculesivmothernatureplatinumedition") {
			gameNamePackage = "12laboursofherculesivmnpe";
		}
		// 4 Elements II Platinum Edition
		// http://games-dl.gamehouse.com/zylom/terminalstudio/dip_nt_zy_en/96c09cc5e16857e20f3e52a109f682fa-dip_nt_zy_en_v3.rfs
		if (gameNamePackage == "4elementsiiplatinumedition") {
			gameNamePackage = gameNamePackage;
		}
		// 7 Wonders - Ancient Alien Makeover Platinum Edition
		// http://games-dl.gamehouse.com/zylom/ghmigration/7wondersancientalienmakeoverpremiumedition/7wondersancientalienmakeoverpremiumedition.rga
		if (gameNamePackage == "7wondersancientalienmakeoverplatinumedition") {
			gameNamePackage = gameNamePackage;
		}
		// Abyss - The Wraiths of Eden Platinum Edition
		// http://games-dl.gamehouse.com/zylom/artifex/dip_nt_zy_en/176b2706d84b64adce6ebfbff2145eb8-dip_nt_zy_en_v2.rfs
		if (gameNamePackage == "abyssthewraithsofedenplatinumedition") {
			gameNamePackage = gameNamePackage;
		}
		
		else {
			gameNamePackage = gameNamePackage.split('platinumedition').join(fixPlatinum);
		}
	}
}


// Check For "Double Pack"
function checkDoublePack(){
	
	// Game Links Tested OK (No "doublepack" ending and 3 of the words are shortened)
	// 4-elements-ii-call-of-atlantis-treasures-of-poseidon-double-pack >> 4elementsiicoatreasuresposeidon
	
	if (gameNameTitle.search("doublepack") != "doublepack") {
	   isDoublePack = "1";
	} 
	
	// Check Names if "Double Pack"
	if (isDoublePack === "1"){
		//alert("Double Pack");
		var fixDoublePack = ""
		
		// Individual Game Name Fixes
		if (gameNamePackage == "4elementsiicallofatlantistreasuresofposeidondoublepack") {
			gameNamePackage = "4elementsiicoatreasuresposeidon";
		}
		else {
			gameNamePackage = gameNamePackage.split("doublepack").join(fixDoublePack);
		}
	}
}

	
// Build New Download Links
function buildNewLinks(){
	
	checkPlatinum();
	checkDoublePack();
	
	
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

// Check New Link
function checkLink(linkToCheck){
	var request;
	if(window.XMLHttpRequest)
		request = new XMLHttpRequest();
	else
		request = new ActiveXObject("Microsoft.XMLHTTP");
	request.open('GET', linkToCheck, false);
	request.send();
	if (request.status == 404) {
		alert("A Dead Link Has Been Created!");
	}
}


// Clone Node
function cloneNode(nodeToClone){
	var srcNode = document.getElementById(nodeToClone);
	var destNode = srcNode.cloneNode(true);
	document.body.appendChild(destNode);
}

// Remove Node
function removeNode(nodeToRemove){
	var getElement = document.getElementById(nodeToRemove);
	var nodeGetParent = getElement.parentNode;
	nodeGetParent.removeChild(getElement);
}

/*
function createNewButton(){
	var hijackID = document.getElementById("dl_now_button");
	var btnTemplate = document.createElement("dl_now_button button");
	spanHijackTextMain.setAttribute("class", "download");
	spanHijackTextMain.innerHTML = "cRypTiC;
	hijackID.insertBefore(btnTemplate, hijackID.nextSibling);
}
*/

function shamelessPlug(){
	var avatar = document.getElementsByClassName("favoritegame_container")[0].innerHTML;
	alert(avatar);
	//avatar.setAttribute("src", "http://ps3dg.com/Images/btn_buynowCC_LG.gif");
	//avatar.insertBefore(spanHijackTextMain, avatar.nextSibling);
}


// Hijack Links
function hijackLinkPlayNow(hjElement, hjLink, hjClass, txtElementMain, txtElementSub, txtClassMain, txtClassSub, txtMainNew, txtSubNew){
	
	// Button Modifier
	var hijackID = document.getElementById(hjElement);
	hijackID.setAttribute("href", hjLink);
	hijackID.setAttribute("class", hjClass);

	// Clear Original Button Text
	hijackID.innerHTML = "";
	

	// Text Modifier Main Button Text
	var spanHijackTextMain = document.createElement(txtElementMain);
	spanHijackTextMain.setAttribute("class", txtClassMain);
	spanHijackTextMain.innerHTML = txtMainNew;

	// Text Modifier Sub Button Text
	var spanHijackTextSub = document.createElement(txtElementSub);
	spanHijackTextSub.setAttribute("class", txtClassSub);
	spanHijackTextSub.innerHTML = txtSubNew;

	// Insert New Text Into Current Page
	hijackID.insertBefore(spanHijackTextMain, hijackID.nextSibling);
	hijackID.insertBefore(spanHijackTextSub, hijackID.nextSibling);
}

function hijackLinkFunpass(hjElement, hjLink, hjClass, txtElementMain, txtElementSub, txtClassMain, txtClassSub, txtMainNew, txtSubNew){

	// Sample Default Funpass Button
	// <div id="funpass_btn">
	//<a href="/memberships/funpass/freetrial" class="funpass">
	//<span class="cta">Unlimited Play</span>
	//<span class="secondary">With FunPass FREE trial.</span>
	//</a>
	//</div>
	
	// Button Modifier
	var hijackClass = document.getElementsByClassName(hjElement)[0].innerHTML;
	alert(hijackClass);
	hijackClass.setAttribute("href", hjLink);
	//hijackIDFP.setAttribute("class", hjClass);

	// Clear Original Button Text
	hijackClass.innerHTML = "";

	// Text Modifier Main Button Text
	//var spanHijackTextMainFunpass = document.createElement("funpass2");
	//spanHijackTextMainFunpass.setAttribute("class", "funpass3");
	//spanHijackTextMainFunpass.innerHTML = txtMainNew;

	// Text Modifier Sub Button Text
	//var spanHijackTextSubFunpass = document.createElement(txtElementSub);
	//spanHijackTextSubFunpass.setAttribute("class", txtClassSub);
	//spanHijackTextSubFunpass.innerHTML = txtSubNew;

	// Insert New Text Into Current Page
	//hijackClass.insertBefore(spanHijackTextMainFunpass, hijackClass.nextSibling);
	//hijackClass.insertBefore(spanHijackTextSubFunpass, hijackClass.nextSibling);
}

// END FUNCTIONS ----------------------------------------------------------------------/



//popupInfo = scriptTitle + gameInfo + linkRFS + "\n\n" + linkRGA + scriptCredits;
//var popupInfo = scriptTitle + gameTitle + linkEXE + "\n\n" + linkRFS + "\n\n" + linkRGA + scriptCredits;


// Popup Game and Package Info
//alert(popupInfo);


// Show an Alert Message To User
//alert(scriptTitle + "\n\nCheck The Bottom of Page For Buttons With Direct Links\n\n" + scriptCredits);


// Get Some Basic Info
getCID();
getGameName();

// Build All Available New Links Based on Content ID and Game Name
buildNewLinks();

// Remove Nodes and Elements
//removeNode(btnPlayNow);
//removeNode(btnFunpass);
//removeNode("buy_now_button");
//removeNode("alreadybought");


// Hijack Button Links
hijackLinkPlayNow(btnPlayNow, linkRFS, "download", "span", "span", "cta", "secondary", "RFS File", "Download Full Package");
hijackLinkFunpass(btnFunpass, linkEXE, "funpass", "span", "span", "cta", "secondary", "EXE File", "Download Game Stub");

//checkLink(linkRFS);
//shamelessPlug();
