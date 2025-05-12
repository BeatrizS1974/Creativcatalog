var app = angular.module("projectsApp", []);

app.controller("projectsCtrl", function ($scope, $http) {
  $scope.project = {
    name: "",
    description: "",
    images: [],
    colors: [],
    links: [],
    items: [],
    tags: []
  };
  $scope.savedProjects = [];
  $scope.selectedProject = null;
  $scope.showNewProjectModal = false;

  // Add project fields
  $scope.addColor = function () {
    $scope.project.colors = $scope.project.colors || [];
    $scope.project.colors.push("");
  };

  $scope.removeColor = function (index) {
    $scope.project.colors.splice(index, 1);
  };

  $scope.addLink = function () {
    $scope.project.links = $scope.project.links || [];
    $scope.project.links.push("");
  };

  $scope.removeLink = function (index) {
    $scope.project.links.splice(index, 1);
  };

  $scope.addProduct = function () {
    $scope.project.items = $scope.project.items || [];
    $scope.project.items.push({
      name: "",
      color: "",
      type: "",
      store: "",
      price: null,
      addToWishlist: false
    });
  };

  $scope.removeProduct = function (index) {
    $scope.project.items.splice(index, 1);
  };

  $scope.addTag = function () {
    $scope.project.tags = $scope.project.tags || [];
    $scope.project.tags.push("");
  };

  $scope.removeTag = function (index) {
    $scope.project.tags.splice(index, 1);
  };

  // Preview uploaded images
  $scope.previewImages = function (input) {
    if (input.files) {
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
          $scope.$apply(() => {
            $scope.project.images.push(e.target.result);
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Save new project
  $scope.submitProject = function () {
    $http.post("/add_project", $scope.project, { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          alert("Project saved!");
          $scope.project = {
            name: "",
            description: "",
            images: [],
            colors: [],
            links: [],
            items: [],
            tags: []
          };
          document.querySelector('input[type="file"]').value = '';
          $scope.showNewProjectModal = false;
          $scope.loadProjects();
        } else {
          alert("Failed to save project.");
        }
      });
  };

  // Load saved projects
  $scope.loadProjects = function () {
    $http.get("/get_projects", { withCredentials: true }).then(res => {
      if (res.data.success) {
        $scope.savedProjects = res.data.projects;
      }
    });
  };

  // Open project for editing
  $scope.openProject = function (proj) {
    console.log("Opening project:", proj.name);
    $scope.selectedProject = angular.copy(proj);
  };

  // Close edit modal (used by both × and Cancel)
  $scope.closeProjectModal = function () {
    $scope.selectedProject = null;
  };

  // Close edit modal if clicking outside
  $scope.closeModal = function (event) {
    if (event.target.classList.contains("modal")) {
      $scope.$apply(() => $scope.closeProjectModal());
    }
  };

  // Close new project modal on background click
  $scope.closeNewModal = function (event) {
    if (event.target.classList.contains("modal")) {
      $scope.$apply(() => $scope.showNewProjectModal = false);
    }
  };

  // Save edits to an existing project
  $scope.saveUpdatedProject = function () {
    const updated = angular.copy($scope.selectedProject);
    delete updated._id;

    $http.put("/update_project/" + $scope.selectedProject._id, updated, { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          alert("Project updated.");
          $scope.selectedProject = null;
          $scope.loadProjects();
        } else {
          alert("Update failed: " + res.data.message);
        }
      });
  };

  // Delete a project
  $scope.deleteProject = function (id) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    $http({
      method: "DELETE",
      url: "/delete_project",
      data: { _id: id },
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    }).then(res => {
      if (res.data.success) {
        alert("Project deleted.");
        $scope.selectedProject = null;
        $scope.loadProjects();
      } else {
        alert("Delete failed.");
      }
    });
  };

  // Initial load
  $scope.loadProjects();
});
