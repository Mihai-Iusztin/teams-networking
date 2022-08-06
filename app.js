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
  //   console.log('display', teams);

  var teamsHTML = '';
  teams.forEach((team) => {
    // console.info(team);
    // transforma in html
    teamsHTML += getTeamHTML(team);
    //   `
    //    <tr>
    //       <td>${team.promotion}</td>
    //       <td>${team.members}</td>
    //       <td>${team.name}</td>
    //       <td>
    //       <a href="${team.url}">open</a>
    //       </td>
    //       <td>x e</td>
    //  </tr>`;
  });
  //afisare
  //   console.warn(teamsHTML);
  document.querySelector('table tbody').innerHTML = teamsHTML;
}

function loadTeams() {
  fetch('data/teams.json')
    .then(function (r) {
      // console.info(r);
      return r.json();
    })
    .then(function (teams) {
      //   console.warn('r', teams);
      displayTeams(teams);
    });
}

loadTeams();
