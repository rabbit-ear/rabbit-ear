/**
 * @description given a full set of transitivity conditions (trios of faces which
 * overlap each other), and the set of pre-computed taco-taco and
 * taco-tortilla events, remove any transitivity condition where the three
 * faces are already covered in a taco-taco case.
 */
const filter_transitivity = (transitivity_trios, tacos_tortillas) => {
  // will contain taco-taco and taco-tortilla events encoded as all
  // permutations of 3 faces involved in each event.
  const tacos_trios = {};
  // using the list of all taco-taco conditions, store all permutations of
  // the three faces (sorted low to high) into a dictionary for quick lookup.
  // store them as space-separated strings.
  tacos_tortillas.taco_taco.map(tacos => [
    [tacos[0][0], tacos[0][1], tacos[1][0]], // a b c
    [tacos[0][0], tacos[0][1], tacos[1][1]], // a b d
    [tacos[0][0], tacos[1][0], tacos[1][1]], // a c d
    [tacos[0][1], tacos[1][0], tacos[1][1]], // b c d
  ])
  .forEach(trios => trios
    .map(trio => trio
      .sort((a, b) => a - b)
      .join(" "))
    .forEach(key => { tacos_trios[key] = true; }));
  // convert all taco-tortilla cases into similarly-formatted,
  // space-separated strings.
  tacos_tortillas.taco_tortilla.map(el => [
    el.taco[0], el.taco[1], el.tortilla
  ])
  .map(trio => trio
    .sort((a, b) => a - b)
    .join(" "))
  .forEach(key => { tacos_trios[key] = true; });
  // return the filtered set of trios.
  return transitivity_trios
    .filter(trio => tacos_trios[trio.join(" ")] === undefined);
};

export default filter_transitivity;
