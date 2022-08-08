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
     <a href="${team.url}">open</a>
     </td>
     <td>x e</td>
</tr>`;
}

function displayTeams(teams) {
  const teamsHTML = teams.map(getTeamHTML);

  document.querySelector('table tbody').innerHTML = teamsHTML.join('');
}

function loadTeams() {
  fetch('data/teams.json')
    .then((r) => r.json())

    .then((teams) => {
      displayTeams(teams);
    });
}

function submitForm(e) {
  // console.warn('submit', e);
  e.preventDefault();

  // var promotion = document.querySelector('input[name=promotion]').value;
  // var members = document.querySelector('input[name=members]').value;
  // var name = document.querySelector('input[name=name]').value;
  // var url = document.querySelector('input[name=url]').value;

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
  console.warn('submit', JSON.stringify(team));
}
function initEvents() {
  const form = document.getElementById('editForm');
  // console.log(form);
  form.addEventListener('submit', submitForm);
}

loadTeams();
initEvents();
