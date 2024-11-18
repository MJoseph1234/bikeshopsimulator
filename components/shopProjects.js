function displayProject(project, index) {
	projectElem = document.getElementById("p"+index);
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
	}
}

function listProjectsWithStatus(status) {
	//returns the index from the projects list, not the project object itself
	var projectList = [];
	for (let i=0; i < projects.length; i++) {
		if (projects[i].hasOwnProperty("status") && projects[i].status == status) {
			projectList.push(i);
		}
	}
	return projectList
}

function refreshProjectDOM() {
	var active = listProjectsWithStatus(projectStatus.ACTIVE);
	for (let i = 0; i < 5; i++) {
		if (i < active.length) {
			displayProject(projects[active[i]], i);
		}
		else {
			projectElem = document.getElementById("p"+i);
			projectElem.getElementsByClassName("project-title")[0].innerHTML = "";
			projectElem.getElementsByClassName("project-cost")[0].innerHTML = "";
			projectElem.getElementsByClassName("project-description")[0].innerHTML = "";
			projectElem.onclick = null;
		}
	}
}

function updateActiveProjects() {
	var active = listProjectsWithStatus(projectStatus.ACTIVE);
	var available = listProjectsWithStatus(projectStatus.AVAILABLE);
	
	while (active.length < 5 && available.length > 0) {
		projects[available[0]].status = projectStatus.ACTIVE;
		active.push(available.shift());
		displayProject(projects[active[active.length - 1]], active.length - 1);
	} 
	for (let i = 0; i < active.length; i++) {
		projectElem = document.getElementById("p"+i);
		projectElem.classList.toggle("disabled", !projects[active[i]].canAfford());
	}
}