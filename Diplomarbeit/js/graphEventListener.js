//Highlight corresponding menuSection
//Done!
function configurePress(element) {
	var mainSectionId = $(element).attr("id").substring(16);
	closeAllMenuSections();
	closeMenuSectionGlobal();
	openMenuSection($("#menuSection_"+mainSectionId).find(".menuHeader"));
}
