let cpView = RabbitEar.origami();
let foldedView = RabbitEar.origami();

cpView.load("../files/fold/crane.fold");
foldedView.load("../files/fold/crane.fold", function(cp){
	foldedView.fold();
});
