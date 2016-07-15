# Linux (default)
EXE1 = kawasaki
EXE2 = graphTest
CFLAGS =
LDFLAGS = -lGL -lGLU -lglut -lm

# Windows (cygwin)
ifeq "$(OS)" "Windows_NT"
	EXE1 = kawasaki.exe
	EXE2 = graphTest.exe
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

all : kawasaki graphTest

$(EXE1) : kawasaki.cpp
	g++ -o $@ $< $(CFLAGS) $(LDFLAGS)

$(EXE2) : graphTest.cpp
	g++ -o $@ $< $(CFLAGS) $(LDFLAGS)

run-kawasaki:
	./$(EXE1) $(ARGS)

run-graph:
	./$(EXE2) $(ARGS)
