import { expect, test } from "vitest";
import fs from "fs";
import ear from "../rabbit-ear.js";

test("getVerticesClusters no clusters", () => {
	const graph = JSON.parse(fs.readFileSync(
		"./tests/files/fold/fan-cp.fold",
		"utf-8",
	));
	const clusters = ear.graph.getVerticesClusters(graph);
	clusters.forEach(cluster => expect(cluster.length).toBe(1));
});

test("getVerticesClusters bird base. clusters", () => {
	const graph = JSON.parse(fs.readFileSync(
		"./tests/files/fold/bird-disjoint-edges.fold",
		"utf-8",
	));
	const clusters = ear.graph.getVerticesClusters(graph);
	// console.log(clusters.map(c => c.length));
	// clusters vary in length, anywhere between 3 to 10
	clusters.forEach(cluster => expect(cluster.length).not.toBe(1));
	clusters.forEach(cluster => expect(cluster.length > 2).toBe(true));
});
