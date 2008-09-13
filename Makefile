#
# Dopploadr
# Richard Crowley <r@rcrowley.org>
#

VERSION=0.1

all:
	zip -r dopploadr.jar content locale skin
	mv chrome.manifest chrome.manifest.dev
	mv chrome.manifest.prod chrome.manifest
	zip dopploadr-$(VERSION).xpi install.rdf chrome.manifest dopploadr.jar
	mv chrome.manifest chrome.manifest.prod
	mv chrome.manifest.dev chrome.manifest

clean:
	rm *.xpi *.jar
