// ==UserScript==
// @name        Gamehouse Package Tool
// @namespace   com.crypticware.ghpkgtool
// @description Parses Content ID from page to create a direct download links to all the package types
// @include     http://www.gamehouse.com/download-games/*
// @include     http://www.gamehouse.com/new-games*
// @version     0.2.5
// @grant       none
// ==/UserScript==



// Part of the RealArcade Wrapper Killer
// cRypTiCwaRe 2016



// This is a side project of mine.
// I am in no way a Javascript programmer, but more of a curious hacker ;)

// I have been involved with hacking, reverse-engineering, and collecting data from RealArcade, and now GameHouse since 2005.

// My code is probably shit, so do not laugh!!!





// START SAMPLE URLS -------------------------------------------------------------------/

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


// RGA (No Lang)
// http://games-dl.gamehouse.com/zylom/popcap/dip_nt_zy_en/MONOPOLY.rga

// RGA (With Lang)
// http://games-dl.gamehouse.com/zylom/mumbo/dip_nt_zy_en/supergloveshero_EN.rga
// http://games-dl.gamehouse.com/zylom/popcap/dip_nt_zy_en/AstroPopDeluxe_EN.rga

// END SAMPLE URLS --------------------------------------------------------------------/



// START DEFAULTS ---------------------------------------------------------------------/

// Basic Info and Text
var scriptVer = "0.2.5";
var scriptTitle = "GH Package Download Tool " + "v" + scriptVer + "\n\n\n";
var scriptCredits = "\n\n\nesc0rtd3w / cRypTiCwaRe 2016";


// Set URL Values For Different Game Types

// Bases URL (EXE Stub)
var baseExeStub = "http://installer-manager.gamehouse.com/InstallerManager/getinstaller?filename=";

// Example URL: $server/$distributor/$developer/$offering
// Server Base URLs
var server = [];
server.push("http://games-dl.gamehouse.com"); // Default GameHouse Download Server
server.push("http://origin.gamehouse.com"); // Alternate Server (Check /gameconsole/)
/*
for (i = 0; i < server.length; i++) {
	alert(server[i]);
}
*/

// Distributor List
var distributor = [];
distributor.push("zylom"); // Default Distributor After Migration

// Developer List
var developer = [];
developer.push("ghmigration"); // Default Zylom Migration
developer.push("artifex");
developer.push("terminalstudio");
developer.push("popcap");
developer.push("mumbo");

// Offering List
var offering = [];
offering.push("dip_nt_zy_en"); // Default Offering (RGA Links Only??)

// Channel List
var channel = [];
channel.push("z_syn_gh_g12"); // Default Zylom/GameHouse Channel

// Language List
var language = [];
language.push("_EN"); // Default RGA English (Newer 2015/2016 Style)

// File Extension List
var ext = [];
ext.push("exe"); // Legacy EXE Game Installer and Stubs
ext.push("rgs"); // Legacy RealArcade Game Installer (XZIP 2.0)
ext.push("rga"); // Original GameHouse WinRAR Compressed Installer
ext.push("rfs"); // New RFS File Format (2015/2016)

var rootDirectory = "";

// Set Default Game Info Values
var base = server[0] + "/" + distributor[0] + "/" + developer[0] + "/";
var gameNameTitle = "Game Name Title Here";
var gameNameWebpage = "game-name-here";
var gameNamePackage = "gamenamehere";
var cid = "00000000000000000000000000000000";

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
var btnFreePlay = "dl_now_button";
var btnFreePlayElement = document.getElementById("dl_now_button");
var btnFunpass = "funpass_btn";
var btnFunpassElement = document.getElementById("funpass_btn");
var btnDiscontinued = "discontinued";
var btnDiscontinuedElement = document.getElementById("discontinued");

// Special Situations (Platinum, Double Pack, Deluxe, Funpass, etc)
var isDeluxe = 0;
var isDoublePack = 0;
var isFreeplay = 0;
var isFunpass = 0;
var isPlatinum = 0;

// Special Filename Situations
var isCopyright = 0;
var isTrademark = 0;

// END DEFAULTS -----------------------------------------------------------------------/



// BEGIN FUNCTIONS --------------------------------------------------------------------/

// Get Root Path
function getRootPath(){
	rootDirectory = window.location.href.substring(25); // Remove http://www.gamehouse.com/
	rootDirectory.split('/');
	for(x=0; x<rootDirectory.length; x++){
		if(/\d+&/i.test(rootDirectory[x])){
			rootDirectory = rootDirectory[x].split('?')[0];
		}
	}
	alert(rootDirectory);
}

// Force Page To Display All Available Games
// This function can cause long page load times depending on the number of items loaded
function showAllGames(){
	var totalGames = document.getElementById("countsOnGameList");
	//totalGames.split(" ");
	var numberOfGamesToShow = 25;
	var startingPoint = 0;
	var linkAllGames = "http://www.gamehouse.com/new-games?platform=pc-games#gametype=download&genre=all&sorting=name&count=" + numberOfGamesToShow + "&filterType=new-games&listView=true&start=" + startingPoint;
	window.location = linkAllGames;
}

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
	

// Check For Platinum Edition
// Main Webpage Link: http://www.gamehouse.com/platinum-games?platform=pc-games
function checkPlatinum(){
	
	// Game Links Tested OK (platinumedition)
	// 9-the-dark-side-of-notre-dame-platinum-edition >> 9thedarksideofnotredameplatinumedition
	// gardens-inc-4-blooming-stars-platinum-edition >> gardensinc4bloomingstarsplatinumedition
	// lost-lands-the-golden-curse-platinum-edition >> lostlandsthegoldencurseplatinumedition
	// mystery-trackers-four-aces-platinum-edition >> mysterytrackersfouracesplatinumedition
	
	// Game Links Tested OK (pe)
	// gardens-inc-4-blooming-stars-platinum-edition >> gardensinc4bloomingstarsplatinumedition
	
	// Game Links Tested OK (1st Letter Only)
	// 12-labours-of-hercules-iv-mother-nature-platinum-edition >> 12laboursofherculesivmnpe
	
	if (gameNameTitle.search("platinumedition") != "platinumedition") {
	   isPlatinum = 1;
	} 
	
	// Check Names if "Platinum Edition"
	if (isPlatinum == 1){
		//alert("Platinum Edition");
		var origPlatinum = 'platinumedition';
		var fixPlatinum = 'pe';
		
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
			//gameNamePackage = gameNamePackage.split('platinumedition').join(fixPlatinum);
			gameNamePackage = gameNamePackage.replace(origPlatinum, fixPlatinum);
		}
	}
}

// Check For "Double Pack"
function checkDoublePack(){
	
	// Game Links Tested OK (No "doublepack" ending and 3 of the words are shortened)
	// 4-elements-ii-call-of-atlantis-treasures-of-poseidon-double-pack >> 4elementsiicoatreasuresposeidon
	
	if (gameNameTitle.search("doublepack") != "doublepack") {
	   isDoublePack = 1;
	} 
	
	// Check Names if "Double Pack"
	if (isDoublePack == 1){
		//alert("Double Pack");
		var fixDoublePack = "";
		
		// Individual Game Name Fixes
		if (gameNamePackage == "4elementsiicallofatlantistreasuresofposeidondoublepack") {
			gameNamePackage = "4elementsiicoatreasuresposeidon";
		}
		else {
			gameNamePackage = gameNamePackage.split("doublepack").join(fixDoublePack);
		}
	}
}

// Check For "Deluxe Edition"
function checkDeluxe(){
	
	// Game Links Tested OK ("deluxe" added to end of name)
	// astro-pop >> astropop >> AstroPopDeluxe_EN.rga
	
	// Change this to an array and a list of matching games (20160324)
	/*
	if (gameNameTitle.search("") != "") {
	   isDeluxe = 1;
	} 
	*/
	
	// Check Names if "Deluxe"
	if (isDeluxe == 1){
		//alert("Deluxe Edition");
		var fixDeluxe = "";
		
		// Individual Game Name Fixes
		if (gameNamePackage == "astropop") {
			gameNamePackage = "astropopdeluxe_en";
		}
		else {
			gameNamePackage = gameNamePackage.split("").join(fixDoublePack);
		}
	}
}

// Check Trademark In Name
function checkTrademark(){
	
	// Game Links Tested OK (Added "tm" to end of filename)
	// plants-vs-zombies >> plantsvszombiestm
	
	if (gameNamePackage == "plantsvszombies") {
	   isTrademark = 1;
	} 
	
	// Check Names if "Trademark"
	if (isTrademark == 1){
		//alert("Trademark");
		var fixTrademark = "tm";
		gameNamePackage = gameNamePackage += fixTrademark;
	}
}

// Check Copyright In Name
function checkCopyright(){
	
	// Game Links Tested OK (Added "tm" to end of filename)
	// plants-vs-zombies >> plantsvszombiestm
	
	if (gameNamePackage == "") {
	   isCopyright = 1;
	} 
	
	// Check Names if "Copyright"
	if (isCopyright == 1){
		//alert("Copyright");
		var fixCopyright = "c";
		gameNamePackage = gameNamePackage += fixCopyright;
	}
}

// Check Freeplay Version
// Example: http://games-dl.gamehouse.com/zylom/ghmigration/amg-texttwist2/amg-texttwist2.rga
// Src: onclick="window.location.href='/pc/postdownload/texttwist-2';return false;"
function checkFreeplay(){
	
	// Game Links Tested OK (Added "amg-" to beginning of filename)
	// text-twist-2 >> texttwist2
	
	if (gameNamePackage == "texttwist2") {
	   isFreeplay = 1;
	} 
	
	// Check Names if "Freeplay"
	if (isFreeplay == 1){
		//alert("Freeplay");
		var fixFreeplay = "amg-";
		gameNamePackage = fixFreeplay += gameNamePackage;
	}
}

// Check For Discontinued Game
function checkDiscontinued(){
	
	// Sample Discontinued Game
	// 1000-light-years-away >> 1000lightyearsaway >> 476fb6e4ba5621765356419ea0f170a7
	/*
	<div class="discontinued">This game is no longer available on our website. 
	<a href="/pc-games" class="link">
	<strong><u>Click here</u></strong></a> to choose and enjoy another game. FunPass and FunTicket members can still play this game. 
	<a href="http://www.gamehouse.com/funpass" target="_blank"><strong><u>Subscribe to FunPass</u></strong></a> or 
	<a href="https://www.gamehouse.com/my-profile" target="_blank"><strong><u>log in if you have FunPass or FunTicket! </u></strong></a></div>
	*/
}

// Check For "Members Only" Games
function checkMembersOnly() {
	
	// Members Only Sticker and Link Sample Source
	// <div class="memberOnlyContainer">
	// <div class="member_only_sticker">
	// <img src="//cdn.ghstatic.com/gamehouse/images/members_only.png?20160229.131.2"></div>
	// <div class="member_only_info">This is a member-only game. <a href="/memberships/funpass/freetrial" style="color:#fff;">Subscribe to FunPass</a> to become a member and get to enjoy all our games.</div>
	// <div style="display: none;" class="member_only_tooltip">This title will be released for everyone in two weeks or less! Sign up for FunPass to play it today! <a href="/memberships/funpass/freetrial">Click here</a> to learn more.</div></div>
	
}

// Build New Download Links
function buildNewLinks(){
	
	checkPlatinum();
	checkDoublePack();
	checkTrademark();
	//checkCopyright();
	checkFreeplay();
	checkDiscontinued();
	
	// Post Download Page
	// http://www.gamehouse.com/pc/postdownload/

	// EXE Stub
	// Sample #1
	// http://installer-manager.gamehouse.com/InstallerManager/getinstaller?filename=8a1c173c8e00ac970f70a78261a15469-incredibledraculachasinglovepe.rfs&offering=incredibledraculachasinglovepe&channel=z_syn_gh_g12
	base = baseExeStub;
	linkEXE = base + cid + "-" + gameNamePackage + "." + ext + "&offering=" + gameNamePackage + "&channel=" + channel[0];

	// RFS
	base = server[0] + "/" + distributor[0] + "/" + developer[0] + "/";
	linkRFS = base + gameNamePackage + "/" + cid + "-" + gameNamePackage + "." + ext[3];

	// RGA
	// Sample Name Only: http://games-dl.gamehouse.com/zylom/ghmigration/superblackjack/superblackjack.rga
	base = "";
	linkRGA = base + gameNamePackage + language[0] + "." + ext[2];

	// RGS
	base = "";
	linkRGA = base + gameNamePackage +  "." + ext[1];
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
function cloneElement(nodeToClone, newID){
	var srcNode = document.getElementById(nodeToClone);
	var destNode = srcNode.cloneNode(true);
	destNode.id = newID;
	document.body.appendChild(destNode);
}

// Remove Node
function removeElement(nodeToRemove){
	var getElement = document.getElementById(nodeToRemove);
	var nodeGetParent = getElement.parentNode;
	nodeGetParent.removeChild(getElement);
}

// Insert Script
function insertScript() {
    //var vScript = document.createElement('script');
    //vScript.type = 'text/javascript'; vScript.async = true;
    //vScript.src = 'file.js';
    //vScript.onload = function(){_v = new VeediEmbed(settings);};
    //var veedi = document.getElementById('veediInit'); veedi.parentNode.insertBefore(vScript, veedi);
}

// Create New Button
function createNewButton(){
	var hijackID_ = document.getElementById("dl_now_button");
	var btnTemplate = document.createElement("dl_now_button");
	hijackID_.setAttribute("class", "download");
	hijackID_.innerHTML = "cRypTiC";
	hijackID_.insertBefore(btnTemplate, hijackID_.nextSibling);
}

// Force Page Load To Stub
function forceStubPage() {
	var path = window.location.pathname;
	pathX = path.replace("download-games", "pc/postdownload");
	//alert(pathX);
	window.location = pathX;
}

// Credits
function shamelessPlug(){
	var credits = "esc0rtd3w / cRypTiCwaRe 2016";
}

// Hijack Links
function hijackLinkPlayNow(hjElement, hjLink, hjClass, txtElementMain, txtElementSub, txtClassMain, txtClassSub, txtMainNew, txtSubNew){
	
	// Button Modifier
	if (isFreeplay == 1){
		var hijackID = document.getElementById(btnFreePlay);
		hijackID.setAttribute("onclick", "window.location.href=\"" + linkRGA);
		hijackID.setAttribute("class", hjClass);
	}
	else {
		var hijackID = document.getElementById(hjElement);
		hijackID.setAttribute("href", hjLink);
		hijackID.setAttribute("class", hjClass);
	}
	
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

function hijackLinkFunpass(hjElement, hjLink){

	// Sample Default Funpass Button
	// <div id="funpass_btn">
	//<a href="/memberships/funpass/freetrial" class="funpass">
	//<span class="cta">Unlimited Play</span>
	//<span class="secondary">With FunPass FREE trial.</span>
	//</a>
	//</div>
	
	// Button Modifier
	var hijackClass = document.getElementsByClassName(hjElement)[0].innerHTML;
	//alert(hijackClass);
	hijackClass.setAttribute("href", hjLink);

	// Clear Original Button Text
	hijackClass.innerHTML = "";
}

// END FUNCTIONS ----------------------------------------------------------------------/



// START TESTING ----------------------------------------------------------------------/

// Build Game Info
//gameTitle = gameNameTitle + "\n\n\n";
//gameInfo = "Game Name (Directory Title): " + gameNameTitle + "\n\n" + "Game Name (Web Info): " + gameNameWebpage + "\n\n" + "Game Name (Package Link): " + gameNamePackage + "\n\n" + "Content ID: " + cid + "\n\n";


//popupInfo = scriptTitle + gameInfo + linkRFS + "\n\n" + linkRGA + scriptCredits;
//var popupInfo = scriptTitle + gameTitle + linkEXE + "\n\n" + linkRFS + "\n\n" + linkRGA + scriptCredits;


// Popup Game and Package Info
//alert(popupInfo);


// Show an Alert Message To User
//alert(scriptTitle + "\n\nCheck The Bottom of Page For Buttons With Direct Links\n\n" + scriptCredits);

//var showMe = window.location.pathname;
//alert(showMe);

/*
function isIE() {
	var myNav = navigator.userAgent.toLowerCase();
	return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}
*/

// END TESTING ----------------------------------------------------------------------/


// START MAIN TOOL ------------------------------------------------------------------/

getRootPath();

// Get Some Basic Info
getCID();
getGameName();

// Build All Available New Links Based on Content ID and Game Name
buildNewLinks();

// Remove Nodes and Elements
//removeElement(btnPlayNow);
removeElement(btnFunpass);
//removeElement("buy_now_button");
//removeElement("alreadybought");

//removeElement("callToAction");

// Other Testing Start

//forceStubPage(); // Force Load To /pc/postdownload/ and Retrieve EXE Stub
//showAllGames(); // Can cause LONG LOAD TIMES!!


// Other Testing End


// Hijack Button Links
hijackLinkPlayNow(btnPlayNow, linkRFS, "download", "span", "span", "cta", "secondary", "RFS File", "Download Full Package");
hijackLinkFunpass(btnFunpass, linkEXE, "funpass", "span", "span", "cta", "secondary", "EXE File", "Download Game Stub");

//cloneElement(btnPlayNow, "cRypTiC_Test");
//createNewButton();

// END MAIN TOOL --------------------------------------------------------------------/
