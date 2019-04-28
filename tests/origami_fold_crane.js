let cpView = RabbitEar.Origami();
let foldedView = RabbitEar.Origami();

cpView.load("../files/fold/crane.fold");
foldedView.load("../files/fold/crane.fold", function(cp){
	foldedView.fold();
});
