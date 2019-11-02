
const getFileInformation = function (fold_file) {
  const { RabbitEar } = window;

  // v e f count
  const vCount = RabbitEar.core.vertices_count(fold_file);
  const eCount = RabbitEar.core.edges_count(fold_file);
  const fCount = RabbitEar.core.faces_count(fold_file);
  const innerCount = `vertices / edges / faces:<br><b>${vCount} / ${eCount} / ${fCount}</b>`;
  // mountain valley mark border count
  const assignmentCounts = fold_file.edges_assignment == null
    ? Array.from(Array(5)).map(() => [])
    : [
      ["M", "m"],
      ["V", "v"],
      ["B", "b"],
      ["F", "f"],
      ["U", "u"]
    ].map(options => fold_file.edges_assignment.filter(e => options.includes(e)));
  const assignmentInfo = `
    mountain: <b>${assignmentCounts[0].length}</b><br>
    valley: <b>${assignmentCounts[1].length}</b><br>
    boundary: <b>${assignmentCounts[2].length}</b><br>
    mark: <b>${assignmentCounts[3].length}</b><br>
    unassigned: <b>${assignmentCounts[4].length}</b><br>`;

  // test 1: flat foldability
  // RabbitEar.kawasaki(fold_file);
  const isFlatFoldable = RabbitEar.core.kawasaki_test(fold_file);
  const flatFoldabilityTest = `${isFlatFoldable
    ? "<span class='pass'>[yes]</span>"
    : "<span class='fail'>[no]</span>"} flat foldable`;

  return [
    innerCount,
    assignmentInfo,
    // innerEpsilon,
    flatFoldabilityTest
  ].join("<br><br>");
};

const oripaTest = function (oripa) {

};

const svgTest = function (svg) {
  // merge tolerance
  // option to re-do merge at different epsilons

  // merge info
  const mergeCount = 0;
  const innerEpsilon = "";
};

const foldTest = function (fold) {

};
