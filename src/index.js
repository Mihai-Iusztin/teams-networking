const API = {
  CREATE: {
    URL: 'http://localhost:3000/teams-json/create',
    METHOD: 'POST',
  },
  READ: {
    URL: 'http://localhost:3000/teams-json',
    METHOD: 'GET',
  },
  UPDATE: {
    URL: 'http://localhost:3000/teams-json/update',
    METHOD: 'PUT',
  },
  DELETE: {
    URL: 'http://localhost:3000/teams-json/delete',
    METHOD: 'DELETE',
  },
};

let allTeams = [];
let editId;

const isDemo = false || location.host === 'mihai-iusztin.github.io';
const inlineChanges = isDemo;
if (isDemo) {
  API.READ.URL = 'data/teams.json';
  API.DELETE.URL = 'data/delete.json';
  API.CREATE.URL = 'data/create.json';
  API.UPDATE.URL = 'data/update.json';

  API.DELETE.METHOD = 'GET';
  API.CREATE.METHOD = 'GET';
  API.UPDATE.METHOD = 'GET';
}

function $(selector) {
  return document.querySelector(selector);
}

function getTeamHTML(team) {
  return `
  <tr>
     <td>${team.promotion}</td>
     <td>${team.members}</td>
     <td>${team.name}</td>
     <td>
     <a href="${team.url}" target="_blank">open</a>
     </td>
     <td>
     <a href="#" data-id= "${team.id}" class = "delete-btn">❌<a/>
     <a href="#" data-id= "${team.id}" class = "edit-btn">&#9998<a/>
     </td>
</tr>`;
}

function displayTeams(teams) {
  const teamsHTML = teams.map(getTeamHTML);

  document.querySelector('table tbody').innerHTML = teamsHTML.join('');
}

function loadTeams() {
  fetch(API.READ.URL)
    .then((r) => r.json())

    .then((teams) => {
      allTeams = teams;
      displayTeams(teams);
    });
}
const method = API.CREATE.METHOD;
function createTeamRequest(team) {
  return fetch(API.CREATE.URL, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method === 'GET' ? null : JSON.stringify(team),
  });
}

function removeTeamRequest(id) {
  const method = API.DELETE.METHOD;
  // console.warn('remove', id);
  return fetch(API.DELETE.URL, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method === 'GET' ? null : JSON.stringify({ id }),
  }).then((r) => r.json());
}

function updateTeamRequest(team) {
  const method = API.UPDATE.METHOD;
  return fetch(API.UPDATE.URL, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method === 'GET' ? null : JSON.stringify(team),
  }).then((r) => r.json());
}

function getFormValues() {
  const promotion = $('input[name=promotion]').value;
  const members = $('input[name=members]').value;
  const name = $('input[name=name]').value;
  const url = $('input[name=url]').value;

  const team = {
    promotion: promotion,
    members: members,
    name: name,
    url: url,
  };
  return team;
}
function setFormValues(team) {
  $('input[name=promotion]').value = team.promotion;
  $('input[name=members]').value = team.members;
  $('input[name=name]').value = team.name;
  $('input[name=url]').value = team.url;
}

function submitForm(e) {
  e.preventDefault();

  const team = getFormValues();

  if (editId) {
    team.id = editId;
    // console.log('pls edit', editId, team);
    updateTeamRequest(team).then((status) => {
      console.warn('status', status);
      if (inlineChanges) {
        allTeams = allTeams.map((t) => (t.id === editId ? team : t));
        displayTeams(allTeams);
      } else {
        loadTeams();
      }
      document.querySelector('#editForm').reset();
    });
  } else {
    createTeamRequest(team)
      .then((r) => r.json())
      .then((status) => {
        console.warn('status', status);
        if (status.success) {
          if (inlineChanges) {
            allTeams = [...allTeams, { ...team, id: status.id }];
            displayTeams(allTeams);
          } else {
            loadTeams();
          }
          document.querySelector('#editForm').reset();
        }
      });
  }
}
function startEditTeam(id) {
  const team = allTeams.find((team) => team.id === id);
  // console.warn('edit', team);
  setFormValues(team);
  editId = id;
}

function initEvents() {
  $('#search').addEventListener('input', (e) => {
    // const search = e.target.value;
    const search = e.target.value.toLowerCase();
    console.log(search);
    const teams = allTeams.filter((team) => {
      console.log('filter', team);
      // return team.promotion === search;
      // return team.promotion.includes(search);
      // return team.promotion.toLowerCase().includes(search.toLowerCase());
      return team.promotion.toLowerCase().includes(search);
    });
    console.log(teams);
    displayTeams(teams);
  });

  const form = $('#editForm');
  form.addEventListener('submit', submitForm);
  form.addEventListener('reset', () => {
    console.warn('reset');
    editId = undefined;
  });

  form.querySelector('tbody').addEventListener('click', (e) => {
    console.warn('click', e);
    console.warn('click', e.target);
    if (e.target.matches('a.delete-btn')) {
      const id = e.target.getAttribute('data-id');
      // const status = removeTeamRequest(id);
      // console.log('status', status);
      removeTeamRequest(id).then((status) => {
        // console.warn('preview', status); //preview {success:true}
        if (status.success) {
          if (inlineChanges) {
            allTeams = allTeams.filter((team) => team.id !== id);
            displayTeams(allTeams);
          } else {
            loadTeams();
          }
        }
      });
    } else if (e.target.matches('a.edit-btn')) {
      const id = e.target.getAttribute('data-id');
      // const status = removeTeamRequest(id);
      // console.log('status', status);
      startEditTeam(id);
      console.warn(e.target.parentNode.parentNode.children[2].innerHTML);
    }
  });
}

loadTeams();
initEvents();
console.log('Hyyyy!');
