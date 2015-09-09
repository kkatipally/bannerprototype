# openmrs_nlp

Built using the OpenMRS module maven archetype.

before packaging this module, you must install the following library to your local maven repository:

maven command:

mvn install:install-file -Dfile=<path-to-file> -DgroupId=org.sfsu.banner -DartifactId=banner -Dversion=.1 -Dpackaging=jar

to build the .omod file, execute:

mvn package 
