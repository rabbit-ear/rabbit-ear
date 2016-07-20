# Linux (default)
EXE1 = test_kawasaki
EXE2 = test_graph
EXE3 = test_planar_graph
CFLAGS =
LDFLAGS = -lGL -lGLU -lglut -lm

# Windows (cygwin)
ifeq "$(OS)" "Windows_NT"
	EXE1 = test_kawasaki.exe
	EXE2 = test_graph.exe
	EXE3 = test_planar_graph.exe
	LDFLAGS = -lopengl32 -lglu32 -lglut32
endif

# OS X, OSTYPE not being declared
ifndef OSTYPE
  OSTYPE = $(shell uname -s|awk '{print tolower($$0)}')
  #export OSTYPE
endif
ifeq ($(OSTYPE),darwin)
	LDFLAGS = -framework Carbon -framework OpenGL -framework GLUT  -Wno-deprecated
endif

all : test_kawasaki test_graph test_planar_graph

$(EXE1) : test_kawasaki.cpp
	g++ -o $@ $< $(CFLAGS) $(LDFLAGS)

$(EXE2) : test_graph.cpp
	g++ -o $@ $< $(CFLAGS) $(LDFLAGS)

$(EXE3) : test_planar_graph.cpp
	g++ -o $@ $< $(CFLAGS) $(LDFLAGS)

run1:
	./$(EXE1) $(ARGS)

run2:
	./$(EXE2) $(ARGS)

run3:
	./$(EXE3) $(ARGS)
