int[] vertices;
boolean[] mountainValley;
int[] yD;
float minX, maxX, minY, maxY;
int margin = 10;

void setup(){
  size(640, 480);
  update();
  strokeWeight(4);
}
void mousePressed(){
  update();
}
void update(){
  
  int size = (int)random(3,10);
  
  vertices = new int[size];
  mountainValley = new boolean[size];
  yD = new int[size];
  
  for(int i = 0; i < size; i++){
    vertices[i] = (int)random(10, 200);
    if(random(2) < 1.0)
      mountainValley[i] = false;
    else
      mountainValley[i] = true;
    yD[i] = (int)random(5,40);
  }
  // run throught a practice draw, grab max and mins
  float originX = width * .5;
  float originY = height * .5;
  float pointX = originX;
  float pointY = originY;
  maxX = originX; minX = originX; maxY = originY; minY = originY;
  for(int i = 0; i < vertices.length; i++){
    float newPointX, newPointY;
    if(i%2 == 0)
      newPointX = pointX + vertices[i];
    else
      newPointX = pointX - vertices[i];
    boolean upOrDown = true;
    if(i < vertices.length-1){
      if((mountainValley[i] && i%2 == 0) || (!mountainValley[i] && i%2 == 1))
        upOrDown = false;
    }
    if(upOrDown)
      newPointY = pointY + yD[i];
    else
      newPointY = pointY - yD[i];
    
    if(newPointX > maxX) maxX = newPointX;
    if(newPointX < minX) minX = newPointX;
    if(newPointY > maxY) maxY = newPointY;
    if(newPointY < minY) minY = newPointY;
    
    pointX = newPointX;
    pointY = newPointY;
  }
}
void keyPressed(){
  for(int i = 0; i < yD.length; i++){
    yD[i] = (int)random(5,40);    
  }
}
void draw(){
  background(255);
  float originX = width * .5;
  float originY = height * .5;
  float pointX = originX;
  float pointY = originY;
  for(int i = 0; i < vertices.length; i++){
    float newPointX, newPointY;
    if(i%2 == 0)
      newPointX = pointX + vertices[i];
    else
      newPointX = pointX - vertices[i];
    boolean upOrDown = true;
    if(i < vertices.length-1){
      if((mountainValley[i] && i%2 == 0) || (!mountainValley[i] && i%2 == 1))
        upOrDown = false;
    }
    if(upOrDown)
      newPointY = pointY + yD[i];
    else
      newPointY = pointY - yD[i];
    if(i != 0){
      stroke(198);
      line(margin + (pointX - minX) * (width-margin*2)/(maxX-minX), pointY, margin + (pointX - minX) * (width-margin*2)/(maxX-minX), newPointY);
    }
    stroke(0);
    line(margin + (pointX - minX) * (width-margin*2)/(maxX-minX), newPointY, margin + (newPointX - minX) * (width-margin*2)/(maxX-minX), newPointY);
    pointX = newPointX;
    pointY = newPointY;
  }
}