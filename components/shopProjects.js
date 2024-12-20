
/**
 * Display the given project in the specified spot
 * 
 * @param {projects.project} project - an object from the projects list
 * @param {number} position - the position (0, 1, 2, 3 or 4) in the project DOM 
 * 		to display this project
 */
function displayProject(project, position) {
	projectElem = document.getElementById("p" + position);
	projectElem.classList.toggle("disabled", !project.canAfford());
	projectElem.getElementsByClassName("project-title")[0].innerHTML = project.title;
	projectElem.getElementsByClassName("project-cost")[0].innerHTML = "(" + project.costStr + ")";
	projectElem.getElementsByClassName("project-description")[0].innerHTML = project.effectDescription;
	projectElem.classList.remove("hidden");
	
	projectElem.onclick = function() {
		project.effect();
		project.status = projectStatus.DONE;
		projectElem.classList.toggle("hidden");
		refreshProjectDOM();
	};
}

/**
 * Get the list of projects with a given status
 * 
 * @param {projectStatus.<status>} status - a project status from the projectStatus const in projects.js
 * 
 * @returns {Array.<number>} a list of numbers that are indexes into the projects list
 */
function listProjectsWithStatus(status) {
	var projectList = [];
	for (let i=0; i < projects.length; i++) {
		if (projects[i].hasOwnProperty("status") && projects[i].status == status) {
			projectList.push(i);
		}
	}
	return projectList
}

/**
 * Update the projects interface component to remove any finished projects and
 * hide unused project containers
 */
function refreshProjectDOM() {
	var active = listProjectsWithStatus(projectStatus.ACTIVE);
	for (let i = 0; i < 5; i++) {
		if (i < active.length) {
			displayProject(projects[active[i]], i);
		}
		else {
			projectElem = document.getElementById("p" + i);
			projectElem.getElementsByClassName("project-title")[0].innerHTML = "";
			projectElem.getElementsByClassName("project-cost")[0].innerHTML = "";
			projectElem.getElementsByClassName("project-description")[0].innerHTML = "";
			projectElem.onclick = null;
		}
	}
}

/**
 * move available/queued projects to the active list up to the active list limit
 * of five.
 */
function updateActiveProjects() {
	var active = listProjectsWithStatus(projectStatus.ACTIVE);
	var available = listProjectsWithStatus(projectStatus.AVAILABLE);
	
	while (active.length < 5 && available.length > 0) {
		projects[available[0]].status = projectStatus.ACTIVE;
		active.push(available.shift());
		displayProject(projects[active[active.length - 1]], active.length - 1);
	} 
	for (let i = 0; i < active.length; i++) {
		projectElem = document.getElementById("p" + i);
		projectElem.classList.toggle("disabled", !projects[active[i]].canAfford());
	}
}