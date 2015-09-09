# Visit Notes Analysis Module Source

Documentation for this module can be found on the OpenMRS Wiki page:

https://wiki.openmrs.org/display/docs/Visit+Notes+Analysis+Module


Built using the OpenMRS module maven archetype.

Before packaging this module, you must install the banner-.1.jar library into your local maven repository.  

maven command:

mvn install:install-file -Dfile=path/to/banner-.1.jar -DgroupId=org.sfsu.banner -DartifactId=banner -Dversion=.1 -Dpackaging=jar

To build the .omod file, execute:

mvn package 
