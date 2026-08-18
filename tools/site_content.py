#!/usr/bin/env python3
"""All copy for the generated pages of ghosttooth.labidi.eu.

Rendered by build-site.py. Keeping every language side by side in one file is
deliberate: when a sentence changes in English, the French and Dutch versions
that need changing with it are three lines away rather than three files away.

Text in `p`, `card`, `ul`, `ol` and table cells is treated as raw HTML so links
and emphasis work. Anything interpolated from user input would need escaping —
there is none here, this is all hand-written editorial copy.
"""

BASE_URL = "https://ghosttooth.labidi.eu/"
PLAY_URL = "https://play.google.com/store/apps/details?id=com.compyra.ghosttooth"
SUPPORT_EMAIL = "ghosttooth@labidi.eu"
SECURITY_EMAIL = "security@compyra.com"

LANGS = {
    "en": {"short": "EN", "name": "English", "og_locale": "en"},
    "fr": {"short": "FR", "name": "Français", "og_locale": "fr_FR"},
    "nl": {"short": "NL", "name": "Nederlands", "og_locale": "nl_NL"},
}

# Footer navigation, rendered on every generated page.
NAV = {
    "_order": [
        {"key": "home", "slug": ""},
        {"key": "faq", "slug": "faq"},
        {"key": "safety", "slug": "safety"},
        {"key": "privacy", "slug": "privacy"},
        {"key": "terms", "slug": "terms"},
        {"key": "accessibility", "slug": "accessibility"},
        {"key": "changelog", "slug": "changelog"},
    ],
    "en": {
        "home": "Scanner", "faq": "Help & FAQ", "safety": "Found a tracker?",
        "privacy": "Privacy", "terms": "Terms", "accessibility": "Accessibility",
        "changelog": "Changelog",
    },
    "fr": {
        "home": "Scanner", "faq": "Aide & FAQ", "safety": "Traceur trouvé ?",
        "privacy": "Confidentialité", "terms": "Conditions", "accessibility": "Accessibilité",
        "changelog": "Journal des versions",
    },
    "nl": {
        "home": "Scanner", "faq": "Help & FAQ", "safety": "Tracker gevonden?",
        "privacy": "Privacy", "terms": "Voorwaarden", "accessibility": "Toegankelijkheid",
        "changelog": "Wijzigingslog",
    },
}

UI = {
    "en": {
        "skip": "Skip to content",
        "language": "Language",
        "footer_nav": "Site sections",
        "updated": "Last updated",
        "footer_note": "GHOSTTOOTH is made by labidi.eu. Questions or a device we should "
                       "recognise? Write to {email}.",
    },
    "fr": {
        "skip": "Aller au contenu",
        "language": "Langue",
        "footer_nav": "Sections du site",
        "updated": "Dernière mise à jour",
        "footer_note": "GHOSTTOOTH est développé par labidi.eu. Une question, ou un appareil "
                       "que nous devrions reconnaître ? Écrivez à {email}.",
    },
    "nl": {
        "skip": "Naar de inhoud",
        "language": "Taal",
        "footer_nav": "Onderdelen van de site",
        "updated": "Laatst bijgewerkt",
        "footer_note": "GHOSTTOOTH wordt gemaakt door labidi.eu. Vragen, of een apparaat dat "
                       "we zouden moeten herkennen? Mail naar {email}.",
    },
}

UPDATED = "2026-08-18"

# ---------------------------------------------------------------------------
# Shared building blocks
# ---------------------------------------------------------------------------

PLAY_BUTTON = {
    "en": {"label": "Get GhostTooth on Google Play", "primary": True},
    "fr": {"label": "Télécharger GhostTooth sur Google Play", "primary": True},
    "nl": {"label": "GhostTooth downloaden in Google Play", "primary": True},
}

SCREENSHOTS = {
    "en": [
        {"src": "media/img/screenshots/scan-list.png", "alt": "GhostTooth device list showing detected Bluetooth devices with threat badges", "caption": "Live scan with confidence-rated badges"},
        {"src": "media/img/screenshots/threat-detail.png", "alt": "Expanded device card explaining why a device was flagged", "caption": "Every verdict explains itself"},
        {"src": "media/img/screenshots/monitoring.png", "alt": "Ongoing notification showing running device counts", "caption": "Background monitoring, no foreground service"},
        {"src": "media/img/screenshots/locate.png", "alt": "Hot and cold locator screen with a large signal percentage", "caption": "Hot/cold locator with audible feedback"},
    ],
    "fr": [
        {"src": "media/img/screenshots/scan-list.png", "alt": "Liste des appareils Bluetooth détectés par GhostTooth avec les badges de menace", "caption": "Analyse en direct avec niveaux de confiance"},
        {"src": "media/img/screenshots/threat-detail.png", "alt": "Fiche d'appareil dépliée expliquant pourquoi il a été signalé", "caption": "Chaque verdict s'explique"},
        {"src": "media/img/screenshots/monitoring.png", "alt": "Notification permanente affichant le nombre d'appareils", "caption": "Surveillance en arrière-plan, sans service au premier plan"},
        {"src": "media/img/screenshots/locate.png", "alt": "Écran de localisation chaud/froid avec un grand pourcentage de signal", "caption": "Localisation chaud/froid avec retour sonore"},
    ],
    "nl": [
        {"src": "media/img/screenshots/scan-list.png", "alt": "Lijst met gedetecteerde bluetooth-apparaten in GhostTooth met dreigingsbadges", "caption": "Live scan met zekerheidsniveaus"},
        {"src": "media/img/screenshots/threat-detail.png", "alt": "Uitgeklapte apparaatkaart die uitlegt waarom een apparaat is gemarkeerd", "caption": "Elk oordeel legt zichzelf uit"},
        {"src": "media/img/screenshots/monitoring.png", "alt": "Blijvende melding met het aantal gevonden apparaten", "caption": "Monitoring op de achtergrond, zonder foreground service"},
        {"src": "media/img/screenshots/locate.png", "alt": "Warm/koud-lokalisatiescherm met een groot signaalpercentage", "caption": "Warm/koud-locator met geluid"},
    ],
}


def _play_block(lang):
    return {
        "type": "buttons",
        "items": [
            {"href": PLAY_URL, "label": PLAY_BUTTON[lang]["label"], "primary": True, "external": True},
        ],
    }


# ---------------------------------------------------------------------------
# /safety/ — the page the app deep-links to from a follow alert
# ---------------------------------------------------------------------------

SAFETY = {
    "updated": UPDATED,
    "langs": {
        "en": {
            "title": "Found a tracker? What to do next — GHOSTTOOTH",
            "og_title": "Found a tracker? What to do next",
            "heading": "You found something. What now?",
            "description": "Practical, calm guidance for anyone who thinks a Bluetooth tracker is following them: preserve the evidence, stay safe, rule out innocent explanations, and find real support.",
            "blocks": [
                {"type": "lede", "text": "If GhostTooth has flagged a device that seems to be travelling with you, take a breath. Most flagged devices turn out to be harmless. But if this one is not, what you do in the next few minutes matters — and the obvious reactions are usually the wrong ones."},
                {"type": "card", "variant": "warn", "title": "If you are in immediate danger", "text": "Stop reading and call your local emergency number. In the EU and the UK that is <strong>112</strong> (999 also works in the UK). This page is for planning, not for emergencies."},
                {"type": "step", "title": "Do not destroy it yet", "text": "A tracker is evidence. Smashing it or throwing it away destroys the record of who put it there, and it tells whoever is watching that they have been found. Leave it where it is for now and photograph it in place, with something for scale."},
                {"type": "step", "title": "Get somewhere safe first", "text": "If you think someone may be tracking you, do not start searching your car or your bag in an isolated place, at night, alone. Go somewhere public and well-lit, or somewhere you trust, and investigate there."},
                {"type": "step", "title": "Save what the app recorded", "text": "The timestamps are the evidence: they show that the same device was near you at separate times and in separate places. In GhostTooth, open <em>Advanced settings → Export monitoring report</em> and keep a copy somewhere the other person cannot reach — a work account, a friend's device, printed paper."},
                {"type": "step", "title": "Rule out the innocent explanations", "text": "Before assuming the worst, work through these. They account for most findings."},
                {"type": "ul", "items": [
                    "A family tag in a shared car, or on a set of keys you both use.",
                    "A tracker in a borrowed bag, coat, pushchair or bike.",
                    "A tag belonging to a hotel, rental car, workplace or delivery.",
                    "A device you own and forgot about — luggage tags are easy to lose track of.",
                    "Someone else's phone or earbuds that happen to be on the same commute as you.",
                ]},
                {"type": "step", "title": "Consider reporting it", "text": "In many countries, tracking a person without their consent is a criminal offence, and may also breach data-protection law. You can contact your local police non-emergency line and show them the exported report. Ask for the report to be logged even if no further action is taken — a paper trail matters if the behaviour continues."},
                {"type": "step", "title": "Talk to someone who does this every day", "text": "Domestic-abuse and stalking support services deal with exactly this and can help you plan safely. They are free and confidential, and contacting them commits you to nothing."},
                {"type": "h2", "text": "Where to find support"},
                {"type": "p", "text": "These are national starting points. If your country is not listed, search for your national domestic-abuse or victim-support helpline, or ask your GP or local police for a referral."},
                {"type": "table", "head": ["Country", "Service", "Contact"], "rows": [
                    ["Belgium (NL)", "1712 — violence, abuse and child abuse helpline", "<strong>1712</strong> · <a href=\"https://1712.be\" rel=\"noopener nofollow\" target=\"_blank\">1712.be</a>"],
                    ["Belgium (FR)", "Écoute Violences Conjugales", "<strong>0800 30 030</strong> · <a href=\"https://www.ecouteviolencesconjugales.be\" rel=\"noopener nofollow\" target=\"_blank\">ecouteviolencesconjugales.be</a>"],
                    ["Netherlands", "Veilig Thuis", "<strong>0800-2000</strong> · <a href=\"https://veiligthuis.nl\" rel=\"noopener nofollow\" target=\"_blank\">veiligthuis.nl</a>"],
                    ["France", "Violences Femmes Info", "<strong>3919</strong> · <a href=\"https://arretonslesviolences.gouv.fr\" rel=\"noopener nofollow\" target=\"_blank\">arretonslesviolences.gouv.fr</a>"],
                    ["United Kingdom", "National Stalking Helpline", "<strong>0808 802 0300</strong> · <a href=\"https://www.suzylamplugh.org\" rel=\"noopener nofollow\" target=\"_blank\">suzylamplugh.org</a>"],
                    ["Germany", "Hilfetelefon Gewalt gegen Frauen", "<strong>116 016</strong> · <a href=\"https://www.hilfetelefon.de\" rel=\"noopener nofollow\" target=\"_blank\">hilfetelefon.de</a>"],
                    ["EU-wide", "Victim Support Europe", "<a href=\"https://victim-support.eu\" rel=\"noopener nofollow\" target=\"_blank\">victim-support.eu</a>"],
                ]},
                {"type": "h2", "text": "A note on digital safety"},
                {"type": "card", "variant": "danger", "text": "If the person you are worried about has access to your phone, your accounts, or your family plan, they may be able to see your browsing history, your installed apps and your location. GhostTooth keeps its safety screen out of your recent-apps list, but it cannot protect your browser history. If that is a risk for you, use a device they cannot reach — a library computer, or a friend's phone."},
                {"type": "h2", "text": "How to physically find the device"},
                {"type": "p", "text": "GhostTooth has a hot/cold locator: long-press a device in the list and choose <em>Locate this device</em>. It shows one large signal percentage that rises as you get closer, and beeps faster the warmer you get."},
                {"type": "ul", "items": [
                    "Move slowly and pause every few steps — the signal needs a moment to settle.",
                    "Bluetooth passes through fabric and plastic, but not metal or water. Your own body blocks it, so the number drops when you turn around.",
                    "Common hiding places: wheel arches, under bumpers, inside seat gaps, in bag linings, under insoles, in coat hems, inside a pushchair frame.",
                    "If a tag has been separated from its owner for long enough, many models start beeping on their own. Silence in a quiet room does not mean nothing is there.",
                ]},
                {"type": "h2", "text": "What GhostTooth cannot tell you"},
                {"type": "p", "text": "Being honest about this matters more than sounding impressive:"},
                {"type": "ul", "items": [
                    "It cannot tell you <em>who</em> placed a device. Bluetooth advertisements carry no owner identity.",
                    "It cannot see trackers that use GPS/GSM without Bluetooth, or devices that are switched off or out of battery.",
                    "It cannot see a tracker hidden inside metal, or one that only wakes up occasionally.",
                    "A flagged device is not proof of anything on its own. The pattern over time is what carries weight.",
                ]},
                {"type": "buttons", "items": [
                    {"href": "{root}faq/", "label": "Read the full FAQ"},
                    {"href": PLAY_URL, "label": "Get GhostTooth on Google Play", "primary": True, "external": True},
                ]},
            ],
        },
        "fr": {
            "title": "Traceur trouvé ? Que faire ensuite — GHOSTTOOTH",
            "og_title": "Traceur trouvé ? Que faire ensuite",
            "heading": "Vous avez trouvé quelque chose. Et maintenant ?",
            "description": "Des conseils concrets et posés si vous pensez qu'un traceur Bluetooth vous suit : préserver les preuves, rester en sécurité, écarter les explications innocentes et trouver de l'aide.",
            "blocks": [
                {"type": "lede", "text": "Si GhostTooth a signalé un appareil qui semble vous suivre, respirez. La plupart des appareils signalés se révèlent inoffensifs. Mais si ce n'est pas le cas, ce que vous faites dans les prochaines minutes compte — et les réactions les plus évidentes sont généralement les mauvaises."},
                {"type": "card", "variant": "warn", "title": "En cas de danger immédiat", "text": "Arrêtez de lire et appelez le numéro d'urgence. Dans l'Union européenne, c'est le <strong>112</strong>. Cette page sert à préparer, pas à gérer une urgence."},
                {"type": "step", "title": "Ne le détruisez pas encore", "text": "Un traceur est une preuve. Le casser ou le jeter détruit la trace de qui l'a placé là, et prévient la personne qui vous surveille qu'elle a été découverte. Laissez-le en place pour l'instant et photographiez-le là où il se trouve, avec un objet pour l'échelle."},
                {"type": "step", "title": "Mettez-vous d'abord en sécurité", "text": "Si vous pensez que quelqu'un vous suit, ne commencez pas à fouiller votre voiture ou votre sac dans un endroit isolé, la nuit, seul·e. Rendez-vous dans un lieu public et bien éclairé, ou chez quelqu'un de confiance, et cherchez là-bas."},
                {"type": "step", "title": "Enregistrez ce que l'application a relevé", "text": "Les horodatages sont la preuve : ils montrent que le même appareil se trouvait près de vous à des moments et des endroits différents. Dans GhostTooth, ouvrez <em>Paramètres avancés → Exporter le rapport de surveillance</em> et gardez une copie hors de portée de l'autre personne — un compte professionnel, l'appareil d'un ami, une impression papier."},
                {"type": "step", "title": "Écartez les explications innocentes", "text": "Avant d'imaginer le pire, passez en revue cette liste. Elle explique la majorité des cas."},
                {"type": "ul", "items": [
                    "Une balise familiale dans une voiture partagée, ou sur un trousseau commun.",
                    "Un traceur dans un sac, un manteau, une poussette ou un vélo empruntés.",
                    "Une balise appartenant à un hôtel, une voiture de location, un employeur ou un colis.",
                    "Un appareil à vous que vous aviez oublié — les étiquettes de bagage se perdent de vue facilement.",
                    "Le téléphone ou les écouteurs de quelqu'un qui fait simplement le même trajet que vous.",
                ]},
                {"type": "step", "title": "Envisagez de le signaler", "text": "Dans de nombreux pays, suivre une personne sans son consentement est une infraction pénale et peut aussi violer le droit de la protection des données. Vous pouvez contacter le numéro non urgent de votre police locale et lui montrer le rapport exporté. Demandez que le signalement soit consigné même si rien d'autre n'est fait : une trace écrite compte si le comportement se poursuit."},
                {"type": "step", "title": "Parlez-en à des professionnels", "text": "Les services d'aide aux victimes de violences conjugales et de harcèlement traitent exactement ce genre de situation et peuvent vous aider à agir en sécurité. C'est gratuit et confidentiel, et les contacter ne vous engage à rien."},
                {"type": "h2", "text": "Où trouver de l'aide"},
                {"type": "p", "text": "Voici des points de départ nationaux. Si votre pays n'y figure pas, cherchez la ligne d'écoute nationale pour les violences conjugales ou l'aide aux victimes, ou demandez une orientation à votre médecin ou à la police locale."},
                {"type": "table", "head": ["Pays", "Service", "Contact"], "rows": [
                    ["Belgique", "Écoute Violences Conjugales", "<strong>0800 30 030</strong> · <a href=\"https://www.ecouteviolencesconjugales.be\" rel=\"noopener nofollow\" target=\"_blank\">ecouteviolencesconjugales.be</a>"],
                    ["Belgique (NL)", "1712 — geweld en misbruik", "<strong>1712</strong> · <a href=\"https://1712.be\" rel=\"noopener nofollow\" target=\"_blank\">1712.be</a>"],
                    ["France", "Violences Femmes Info", "<strong>3919</strong> · <a href=\"https://arretonslesviolences.gouv.fr\" rel=\"noopener nofollow\" target=\"_blank\">arretonslesviolences.gouv.fr</a>"],
                    ["France", "France Victimes", "<strong>116 006</strong> · <a href=\"https://www.france-victimes.fr\" rel=\"noopener nofollow\" target=\"_blank\">france-victimes.fr</a>"],
                    ["Suisse", "Aide aux victimes", "<a href=\"https://www.aide-aux-victimes.ch\" rel=\"noopener nofollow\" target=\"_blank\">aide-aux-victimes.ch</a>"],
                    ["Union européenne", "Victim Support Europe", "<a href=\"https://victim-support.eu\" rel=\"noopener nofollow\" target=\"_blank\">victim-support.eu</a>"],
                ]},
                {"type": "h2", "text": "À propos de la sécurité numérique"},
                {"type": "card", "variant": "danger", "text": "Si la personne qui vous inquiète a accès à votre téléphone, à vos comptes ou à votre abonnement familial, elle peut voir votre historique de navigation, vos applications installées et votre position. GhostTooth garde son écran de sécurité hors de la liste des applications récentes, mais ne peut pas protéger l'historique de votre navigateur. Si c'est un risque pour vous, utilisez un appareil hors de sa portée — un ordinateur de bibliothèque, ou le téléphone d'un ami."},
                {"type": "h2", "text": "Comment retrouver physiquement l'appareil"},
                {"type": "p", "text": "GhostTooth intègre une localisation chaud/froid : appuyez longuement sur un appareil dans la liste et choisissez <em>Localiser cet appareil</em>. Un grand pourcentage de signal augmente à mesure que vous approchez, et les bips s'accélèrent."},
                {"type": "ul", "items": [
                    "Avancez lentement et faites une pause tous les quelques pas — le signal a besoin d'un instant pour se stabiliser.",
                    "Le Bluetooth traverse le tissu et le plastique, mais pas le métal ni l'eau. Votre propre corps le bloque : le chiffre baisse quand vous vous retournez.",
                    "Cachettes fréquentes : passages de roue, sous les pare-chocs, interstices des sièges, doublures de sac, sous les semelles, ourlets de manteau, châssis de poussette.",
                    "Séparés assez longtemps de leur propriétaire, beaucoup de modèles se mettent à sonner d'eux-mêmes. Le silence dans une pièce calme ne prouve rien.",
                ]},
                {"type": "h2", "text": "Ce que GhostTooth ne peut pas vous dire"},
                {"type": "p", "text": "Être honnête là-dessus compte plus que d'avoir l'air impressionnant :"},
                {"type": "ul", "items": [
                    "Il ne peut pas dire <em>qui</em> a placé un appareil. Les trames Bluetooth ne contiennent aucune identité de propriétaire.",
                    "Il ne voit pas les traceurs GPS/GSM sans Bluetooth, ni les appareils éteints ou déchargés.",
                    "Il ne voit pas un traceur enfermé dans du métal, ni un modèle qui ne se réveille qu'occasionnellement.",
                    "Un appareil signalé ne prouve rien à lui seul. C'est la régularité dans le temps qui compte.",
                ]},
                {"type": "buttons", "items": [
                    {"href": "{root}fr/faq/", "label": "Lire la FAQ complète"},
                    {"href": PLAY_URL, "label": "Télécharger sur Google Play", "primary": True, "external": True},
                ]},
            ],
        },
        "nl": {
            "title": "Tracker gevonden? Wat nu — GHOSTTOOTH",
            "og_title": "Tracker gevonden? Wat nu",
            "heading": "Je hebt iets gevonden. Wat nu?",
            "description": "Rustige, praktische stappen als je denkt dat een bluetooth-tracker je volgt: bewijs bewaren, veilig blijven, onschuldige verklaringen uitsluiten en echte hulp vinden.",
            "blocks": [
                {"type": "lede", "text": "Als GhostTooth een apparaat heeft gemarkeerd dat met je mee lijkt te reizen: haal even adem. De meeste gemarkeerde apparaten blijken onschuldig. Maar als dit er geen van is, telt wat je de komende minuten doet — en de voor de hand liggende reacties zijn meestal de verkeerde."},
                {"type": "card", "variant": "warn", "title": "Bij direct gevaar", "text": "Stop met lezen en bel het alarmnummer. In de EU is dat <strong>112</strong>. Deze pagina is bedoeld om een plan te maken, niet voor noodgevallen."},
                {"type": "step", "title": "Vernietig hem nog niet", "text": "Een tracker is bewijs. Hem kapotmaken of weggooien vernietigt het spoor naar wie hem geplaatst heeft, en waarschuwt degene die meekijkt dat hij ontdekt is. Laat hem voorlopig liggen en fotografeer hem waar hij ligt, met iets erbij voor de schaal."},
                {"type": "step", "title": "Zorg eerst dat je veilig bent", "text": "Als je denkt dat iemand je volgt, ga dan niet 's avonds in je eentje op een afgelegen plek je auto of tas doorzoeken. Ga naar een openbare, goed verlichte plaats of naar iemand die je vertrouwt, en zoek daar verder."},
                {"type": "step", "title": "Bewaar wat de app heeft vastgelegd", "text": "De tijdstempels zijn het bewijs: ze laten zien dat hetzelfde apparaat op verschillende momenten en plaatsen bij je in de buurt was. Open in GhostTooth <em>Geavanceerde instellingen → Monitoringrapport exporteren</em> en bewaar een kopie waar de ander niet bij kan — een werkaccount, het toestel van een vriend, of op papier."},
                {"type": "step", "title": "Sluit de onschuldige verklaringen uit", "text": "Loop deze lijst eerst langs. Hij verklaart de meeste vondsten."},
                {"type": "ul", "items": [
                    "Een tag van een gezinslid in een gedeelde auto of aan een gezamenlijke sleutelbos.",
                    "Een tracker in een geleende tas, jas, kinderwagen of fiets.",
                    "Een tag van een hotel, huurauto, werkgever of pakketbezorger.",
                    "Een apparaat van jezelf dat je vergeten was — bagagetags raken snel uit beeld.",
                    "Iemands telefoon of oordopjes die simpelweg dezelfde route rijden als jij.",
                ]},
                {"type": "step", "title": "Overweeg aangifte te doen", "text": "In veel landen is het volgen van een persoon zonder toestemming strafbaar, en kan het ook in strijd zijn met de privacywetgeving. Je kunt het niet-spoednummer van de lokale politie bellen en het geëxporteerde rapport laten zien. Vraag of de melding wordt geregistreerd, ook als er verder niets gebeurt: een papieren spoor telt als het gedrag doorgaat."},
                {"type": "step", "title": "Praat met mensen die dit dagelijks doen", "text": "Hulpdiensten voor huiselijk geweld en stalking kennen precies dit soort situaties en kunnen je helpen veilig een plan te maken. Ze zijn gratis en vertrouwelijk, en contact opnemen verplicht je tot niets."},
                {"type": "h2", "text": "Waar je hulp vindt"},
                {"type": "p", "text": "Dit zijn nationale startpunten. Staat jouw land er niet bij, zoek dan de landelijke hulplijn voor huiselijk geweld of slachtofferhulp, of vraag je huisarts of de lokale politie om een doorverwijzing."},
                {"type": "table", "head": ["Land", "Dienst", "Contact"], "rows": [
                    ["Nederland", "Veilig Thuis", "<strong>0800-2000</strong> · <a href=\"https://veiligthuis.nl\" rel=\"noopener nofollow\" target=\"_blank\">veiligthuis.nl</a>"],
                    ["Nederland", "Slachtofferhulp Nederland", "<strong>0900-0101</strong> · <a href=\"https://www.slachtofferhulp.nl\" rel=\"noopener nofollow\" target=\"_blank\">slachtofferhulp.nl</a>"],
                    ["België", "1712 — geweld, misbruik en kindermishandeling", "<strong>1712</strong> · <a href=\"https://1712.be\" rel=\"noopener nofollow\" target=\"_blank\">1712.be</a>"],
                    ["België", "Tele-Onthaal", "<strong>106</strong> · <a href=\"https://www.tele-onthaal.be\" rel=\"noopener nofollow\" target=\"_blank\">tele-onthaal.be</a>"],
                    ["Europa", "Victim Support Europe", "<a href=\"https://victim-support.eu\" rel=\"noopener nofollow\" target=\"_blank\">victim-support.eu</a>"],
                ]},
                {"type": "h2", "text": "Over digitale veiligheid"},
                {"type": "card", "variant": "danger", "text": "Als de persoon over wie je je zorgen maakt toegang heeft tot je telefoon, je accounts of je gezinsabonnement, kan die je browsegeschiedenis, geïnstalleerde apps en locatie zien. GhostTooth houdt het veiligheidsscherm buiten je lijst met recente apps, maar kan je browsergeschiedenis niet beschermen. Als dat voor jou een risico is, gebruik dan een apparaat waar die persoon niet bij kan — een computer in de bibliotheek, of de telefoon van een vriend."},
                {"type": "h2", "text": "Het apparaat fysiek terugvinden"},
                {"type": "p", "text": "GhostTooth heeft een warm/koud-locator: houd een apparaat in de lijst ingedrukt en kies <em>Dit apparaat lokaliseren</em>. Eén groot signaalpercentage loopt op naarmate je dichterbij komt, en het piepen gaat sneller."},
                {"type": "ul", "items": [
                    "Loop langzaam en pauzeer om de paar stappen — het signaal heeft even nodig om te stabiliseren.",
                    "Bluetooth gaat door stof en plastic heen, maar niet door metaal of water. Je eigen lichaam blokkeert het, dus het getal zakt als je je omdraait.",
                    "Veelgebruikte plekken: wielkasten, onder bumpers, spleten in stoelen, voeringen van tassen, onder inlegzolen, jaszomen, het frame van een kinderwagen.",
                    "Als een tag lang genoeg van zijn eigenaar gescheiden is, gaan veel modellen vanzelf piepen. Stilte in een rustige kamer bewijst niets.",
                ]},
                {"type": "h2", "text": "Wat GhostTooth je niet kan vertellen"},
                {"type": "p", "text": "Hier eerlijk over zijn is belangrijker dan indrukwekkend klinken:"},
                {"type": "ul", "items": [
                    "Het kan niet zeggen <em>wie</em> een apparaat heeft geplaatst. Bluetooth-berichten bevatten geen eigenaarsidentiteit.",
                    "Het ziet geen GPS/GSM-trackers zonder bluetooth, en geen uitgeschakelde of lege apparaten.",
                    "Het ziet geen tracker die in metaal is weggewerkt, of die maar af en toe wakker wordt.",
                    "Een gemarkeerd apparaat is op zichzelf geen bewijs. Het patroon over tijd is wat telt.",
                ]},
                {"type": "buttons", "items": [
                    {"href": "{root}nl/faq/", "label": "Lees de volledige FAQ"},
                    {"href": PLAY_URL, "label": "Downloaden in Google Play", "primary": True, "external": True},
                ]},
            ],
        },
    },
}

# ---------------------------------------------------------------------------
# /terms/
# ---------------------------------------------------------------------------

TERMS_COMMON_EN = [
    {"type": "lede", "text": "Plain-language terms for using the GhostTooth app and this website. Nothing here takes away rights you have under Belgian or EU consumer law."},
    {"type": "h2", "text": "1. What GhostTooth is"},
    {"type": "p", "text": "GhostTooth is a free tool that listens for Bluetooth Low Energy advertisement packets and tells you which nearby devices look like trackers or surveillance hardware. It is provided as-is, for personal safety and curiosity."},
    {"type": "h2", "text": "2. What it is not"},
    {"type": "card", "variant": "warn", "text": "GhostTooth is <strong>not a guaranteed security tool</strong>. Bluetooth detection is inherently incomplete: a device that is switched off, out of battery, shielded by metal, using a non-Bluetooth radio, or simply not in our detection registry will not be found. Never treat a clean scan as proof that nothing is there, and never rely on GhostTooth alone in a situation where your safety depends on the answer."},
    {"type": "h2", "text": "3. Acceptable use"},
    {"type": "p", "text": "You may use GhostTooth to check your own person, belongings, vehicle and property. You must not use it to locate, follow, harass or surveil another person, or to interfere with devices you do not own. Doing so is likely to be a criminal offence where you live, and is squarely against the purpose of this tool."},
    {"type": "h2", "text": "4. No warranty"},
    {"type": "p", "text": "The software is provided \"as is\", without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose and non-infringement. We do not warrant that detection will be accurate, complete or uninterrupted."},
    {"type": "h2", "text": "5. Limitation of liability"},
    {"type": "p", "text": "To the fullest extent permitted by law, we are not liable for any indirect, incidental or consequential loss arising from use of GhostTooth, including any loss arising from a device we failed to detect or from a device we flagged that turned out to be harmless. Nothing in these terms excludes liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot lawfully be excluded."},
    {"type": "h2", "text": "6. Not legal advice"},
    {"type": "p", "text": "The guidance on our <a href=\"{root}safety/\">safety page</a> is general information, not legal advice. Laws about tracking, evidence and privacy vary widely. Speak to the police, a lawyer or a support service about your specific situation."},
    {"type": "h2", "text": "7. Detection definitions"},
    {"type": "p", "text": "The app periodically downloads updated detection definitions from this website. These are best-effort, curated from public sources and real-world findings. They may be incomplete or occasionally wrong. No scan data or personal data is ever uploaded — see the <a href=\"{root}privacy/\">privacy policy</a>."},
    {"type": "h2", "text": "8. Changes"},
    {"type": "p", "text": "We may update these terms. Material changes will be noted on the <a href=\"{root}changelog/\">changelog</a>, and the date at the top of this page will change."},
    {"type": "h2", "text": "9. Governing law and contact"},
    {"type": "p", "text": "These terms are governed by Belgian law. Questions: <a href=\"mailto:" + SUPPORT_EMAIL + "\">" + SUPPORT_EMAIL + "</a>. Security reports: <a href=\"mailto:" + SECURITY_EMAIL + "\">" + SECURITY_EMAIL + "</a>."},
]

TERMS = {
    "updated": UPDATED,
    "langs": {
        "en": {
            "title": "Terms of Use — GHOSTTOOTH",
            "og_title": "GHOSTTOOTH — Terms of Use",
            "heading": "Terms of use",
            "description": "Plain-language terms for the GhostTooth Bluetooth tracker detector: what it is, what it is not, acceptable use, and the limits of what a detection tool can promise.",
            "blocks": TERMS_COMMON_EN,
        },
        "fr": {
            "title": "Conditions d'utilisation — GHOSTTOOTH",
            "og_title": "GHOSTTOOTH — Conditions d'utilisation",
            "heading": "Conditions d'utilisation",
            "description": "Conditions en langage clair pour le détecteur de traceurs Bluetooth GhostTooth : ce qu'il est, ce qu'il n'est pas, l'usage acceptable et les limites d'un outil de détection.",
            "blocks": [
                {"type": "lede", "text": "Conditions en langage clair pour l'application GhostTooth et ce site. Rien ici ne retire les droits dont vous disposez au titre du droit belge ou européen de la consommation."},
                {"type": "h2", "text": "1. Ce qu'est GhostTooth"},
                {"type": "p", "text": "GhostTooth est un outil gratuit qui écoute les trames Bluetooth Low Energy et vous indique quels appareils proches ressemblent à des traceurs ou à du matériel de surveillance. Il est fourni tel quel, pour votre sécurité personnelle et par curiosité."},
                {"type": "h2", "text": "2. Ce qu'il n'est pas"},
                {"type": "card", "variant": "warn", "text": "GhostTooth <strong>n'est pas un outil de sécurité garanti</strong>. La détection Bluetooth est par nature incomplète : un appareil éteint, déchargé, blindé par du métal, utilisant une autre radio que le Bluetooth, ou simplement absent de notre base de détection ne sera pas trouvé. Ne considérez jamais une analyse vierge comme la preuve qu'il n'y a rien, et ne comptez jamais sur GhostTooth seul lorsque votre sécurité dépend de la réponse."},
                {"type": "h2", "text": "3. Usage acceptable"},
                {"type": "p", "text": "Vous pouvez utiliser GhostTooth pour vérifier votre personne, vos affaires, votre véhicule et votre domicile. Vous ne devez pas l'utiliser pour localiser, suivre, harceler ou surveiller autrui, ni pour interférer avec des appareils qui ne vous appartiennent pas. Ce serait très probablement une infraction pénale là où vous vivez, et cela va directement à l'encontre de la raison d'être de cet outil."},
                {"type": "h2", "text": "4. Absence de garantie"},
                {"type": "p", "text": "Le logiciel est fourni « en l'état », sans garantie d'aucune sorte, expresse ou implicite, y compris les garanties de qualité marchande, d'adéquation à un usage particulier et d'absence de contrefaçon. Nous ne garantissons pas que la détection sera exacte, complète ou ininterrompue."},
                {"type": "h2", "text": "5. Limitation de responsabilité"},
                {"type": "p", "text": "Dans toute la mesure permise par la loi, nous ne sommes pas responsables des pertes indirectes ou consécutives découlant de l'utilisation de GhostTooth, y compris celles résultant d'un appareil que nous n'aurions pas détecté ou d'un appareil signalé qui s'avère inoffensif. Rien dans ces conditions n'exclut la responsabilité en cas de décès ou de dommage corporel causé par une négligence, de fraude, ou de tout autre cas qui ne peut légalement être exclu."},
                {"type": "h2", "text": "6. Pas un conseil juridique"},
                {"type": "p", "text": "Les conseils de notre <a href=\"{root}fr/safety/\">page sécurité</a> sont des informations générales, pas un conseil juridique. Les lois sur le suivi, la preuve et la vie privée varient fortement. Parlez de votre situation précise à la police, à un avocat ou à un service d'aide."},
                {"type": "h2", "text": "7. Définitions de détection"},
                {"type": "p", "text": "L'application télécharge régulièrement des définitions de détection mises à jour depuis ce site. Elles sont établies au mieux, à partir de sources publiques et de constats de terrain. Elles peuvent être incomplètes ou parfois erronées. Aucune donnée d'analyse ni donnée personnelle n'est jamais envoyée — voir la <a href=\"{root}fr/privacy/\">politique de confidentialité</a>."},
                {"type": "h2", "text": "8. Modifications"},
                {"type": "p", "text": "Nous pouvons mettre à jour ces conditions. Les changements importants seront indiqués dans le <a href=\"{root}changelog/\">journal des versions</a>, et la date en haut de cette page changera."},
                {"type": "h2", "text": "9. Droit applicable et contact"},
                {"type": "p", "text": "Ces conditions sont régies par le droit belge. Questions : <a href=\"mailto:" + SUPPORT_EMAIL + "\">" + SUPPORT_EMAIL + "</a>. Signalements de sécurité : <a href=\"mailto:" + SECURITY_EMAIL + "\">" + SECURITY_EMAIL + "</a>."},
            ],
        },
        "nl": {
            "title": "Gebruiksvoorwaarden — GHOSTTOOTH",
            "og_title": "GHOSTTOOTH — Gebruiksvoorwaarden",
            "heading": "Gebruiksvoorwaarden",
            "description": "Voorwaarden in gewone taal voor de GhostTooth bluetooth-trackerdetector: wat het is, wat het niet is, acceptabel gebruik en de grenzen van wat een detectietool kan beloven.",
            "blocks": [
                {"type": "lede", "text": "Voorwaarden in gewone taal voor de GhostTooth-app en deze website. Niets hierin doet af aan je rechten onder het Belgische of Europese consumentenrecht."},
                {"type": "h2", "text": "1. Wat GhostTooth is"},
                {"type": "p", "text": "GhostTooth is een gratis hulpmiddel dat luistert naar Bluetooth Low Energy-berichten en je vertelt welke apparaten in de buurt op trackers of surveillanceapparatuur lijken. Het wordt geleverd zoals het is, voor je persoonlijke veiligheid en uit nieuwsgierigheid."},
                {"type": "h2", "text": "2. Wat het niet is"},
                {"type": "card", "variant": "warn", "text": "GhostTooth is <strong>geen gegarandeerd beveiligingsmiddel</strong>. Bluetooth-detectie is per definitie onvolledig: een apparaat dat uit staat, leeg is, door metaal wordt afgeschermd, een andere radio dan bluetooth gebruikt of simpelweg niet in onze detectiedatabase staat, wordt niet gevonden. Beschouw een schone scan nooit als bewijs dat er niets is, en vertrouw nooit alleen op GhostTooth als je veiligheid van het antwoord afhangt."},
                {"type": "h2", "text": "3. Acceptabel gebruik"},
                {"type": "p", "text": "Je mag GhostTooth gebruiken om jezelf, je spullen, je voertuig en je woning te controleren. Je mag het niet gebruiken om iemand anders te lokaliseren, te volgen, lastig te vallen of te bespioneren, of om apparaten te verstoren die niet van jou zijn. Dat is waar je woont hoogstwaarschijnlijk strafbaar, en het gaat lijnrecht in tegen het doel van dit hulpmiddel."},
                {"type": "h2", "text": "4. Geen garantie"},
                {"type": "p", "text": "De software wordt geleverd \"zoals hij is\", zonder enige garantie, expliciet of impliciet, inclusief garanties van verkoopbaarheid, geschiktheid voor een bepaald doel en niet-inbreuk. We garanderen niet dat de detectie accuraat, volledig of ononderbroken is."},
                {"type": "h2", "text": "5. Beperking van aansprakelijkheid"},
                {"type": "p", "text": "Voor zover de wet dat toestaat zijn wij niet aansprakelijk voor indirecte of gevolgschade door het gebruik van GhostTooth, inclusief schade doordat we een apparaat niet hebben gedetecteerd of doordat we een apparaat markeerden dat onschuldig bleek. Niets in deze voorwaarden sluit aansprakelijkheid uit voor overlijden of letsel door nalatigheid, voor fraude, of voor iets anders dat wettelijk niet kan worden uitgesloten."},
                {"type": "h2", "text": "6. Geen juridisch advies"},
                {"type": "p", "text": "De informatie op onze <a href=\"{root}nl/safety/\">veiligheidspagina</a> is algemene voorlichting, geen juridisch advies. Wetgeving over volgen, bewijs en privacy verschilt sterk. Bespreek jouw specifieke situatie met de politie, een advocaat of een hulpdienst."},
                {"type": "h2", "text": "7. Detectiedefinities"},
                {"type": "p", "text": "De app downloadt periodiek bijgewerkte detectiedefinities van deze website. Die zijn naar beste vermogen samengesteld uit openbare bronnen en waarnemingen in het veld. Ze kunnen onvolledig of soms onjuist zijn. Er worden nooit scangegevens of persoonsgegevens geüpload — zie het <a href=\"{root}nl/privacy/\">privacybeleid</a>."},
                {"type": "h2", "text": "8. Wijzigingen"},
                {"type": "p", "text": "We kunnen deze voorwaarden bijwerken. Belangrijke wijzigingen worden vermeld in het <a href=\"{root}changelog/\">wijzigingslog</a>, en de datum bovenaan deze pagina verandert."},
                {"type": "h2", "text": "9. Toepasselijk recht en contact"},
                {"type": "p", "text": "Op deze voorwaarden is Belgisch recht van toepassing. Vragen: <a href=\"mailto:" + SUPPORT_EMAIL + "\">" + SUPPORT_EMAIL + "</a>. Beveiligingsmeldingen: <a href=\"mailto:" + SECURITY_EMAIL + "\">" + SECURITY_EMAIL + "</a>."},
            ],
        },
    },
}

# ---------------------------------------------------------------------------
# /accessibility/
# ---------------------------------------------------------------------------

ACCESSIBILITY = {
    "updated": UPDATED,
    "langs": {
        "en": {
            "title": "Accessibility statement — GHOSTTOOTH",
            "og_title": "GHOSTTOOTH — Accessibility statement",
            "heading": "Accessibility statement",
            "description": "How accessible the GhostTooth app and website are, what we have done, what we know is still imperfect, and how to tell us when something does not work for you.",
            "blocks": [
                {"type": "lede", "text": "A safety tool that only works for some people is not a safety tool. This page says plainly where GhostTooth stands, including the parts that are not good enough yet."},
                {"type": "h2", "text": "Target"},
                {"type": "p", "text": "We aim to meet <strong>WCAG 2.1 level AA</strong> on this website, and to follow the Android accessibility guidelines in the app. We have not commissioned a formal third-party audit, so this is a self-assessment."},
                {"type": "h2", "text": "What is in place"},
                {"type": "ul", "items": [
                    "Every page is a single file with no external fonts or scripts, so it renders and reflows even on a slow or blocked connection.",
                    "Dark and light themes both meet AA contrast; the site follows your system preference rather than forcing one.",
                    "Semantic landmarks, a logical heading order, and a skip-to-content link on every page.",
                    "Touch targets of at least 48×48 px throughout the app and the site.",
                    "In the app, threat badges carry spoken descriptions — a screen reader announces \"Surveillance device, confirmed confidence\" rather than reading out a coloured symbol.",
                    "The hot/cold locator gives both sound and haptic feedback, pulsing faster and harder as you close in, so it works if you cannot hear the beeps or cannot make a sound while searching.",
                    "Threat level is never conveyed by colour alone: each badge also carries a symbol and a word.",
                    "Text scales with your system font size without clipping.",
                ]},
                {"type": "h2", "text": "Known gaps"},
                {"type": "p", "text": "We would rather list these than pretend they do not exist:"},
                {"type": "ul", "items": [
                    "The experimental presence timeline in the app is a purely visual chart with no textual equivalent yet.",
                    "The web scanner's live device list updates frequently; screen-reader users may find the app a calmer experience.",
                    "Some longer explanatory text has not been through a plain-language review.",
                ]},
                {"type": "h2", "text": "Tell us when something does not work"},
                {"type": "p", "text": "If any part of GhostTooth is difficult or impossible for you to use, please write to <a href=\"mailto:" + SUPPORT_EMAIL + "\">" + SUPPORT_EMAIL + "</a> and describe what happened and what you were using. Accessibility reports get treated as bugs, not as feature requests."},
            ],
        },
        "fr": {
            "title": "Déclaration d'accessibilité — GHOSTTOOTH",
            "og_title": "GHOSTTOOTH — Déclaration d'accessibilité",
            "heading": "Déclaration d'accessibilité",
            "description": "Le niveau d'accessibilité de l'application et du site GhostTooth, ce qui est en place, ce qui reste imparfait, et comment nous signaler un problème.",
            "blocks": [
                {"type": "lede", "text": "Un outil de sécurité qui ne fonctionne que pour certaines personnes n'est pas un outil de sécurité. Cette page dit clairement où en est GhostTooth, y compris ce qui n'est pas encore satisfaisant."},
                {"type": "h2", "text": "Objectif"},
                {"type": "p", "text": "Nous visons le niveau <strong>AA des WCAG 2.1</strong> sur ce site, et le respect des recommandations d'accessibilité Android dans l'application. Aucun audit externe formel n'a été commandé : il s'agit donc d'une auto-évaluation."},
                {"type": "h2", "text": "Ce qui est en place"},
                {"type": "ul", "items": [
                    "Chaque page est un fichier unique sans police ni script externe : elle s'affiche même sur une connexion lente ou filtrée.",
                    "Les thèmes sombre et clair respectent tous deux le contraste AA ; le site suit votre préférence système au lieu d'en imposer une.",
                    "Repères sémantiques, hiérarchie de titres logique et lien « aller au contenu » sur chaque page.",
                    "Zones tactiles d'au moins 48 × 48 px dans l'application comme sur le site.",
                    "Dans l'application, les badges de menace portent une description vocale — un lecteur d'écran annonce « Appareil de surveillance, confiance confirmée » au lieu de lire un symbole coloré.",
                    "Le niveau de menace n'est jamais transmis par la couleur seule : chaque badge porte aussi un symbole et un mot.",
                    "Le texte suit la taille de police du système sans être tronqué.",
                ]},
                {"type": "h2", "text": "Limites connues"},
                {"type": "p", "text": "Nous préférons les lister plutôt que faire comme si elles n'existaient pas :"},
                {"type": "ul", "items": [
                    "La frise de présence expérimentale est un graphique purement visuel, sans équivalent textuel pour l'instant.",
                    "La localisation chaud/froid est utilisable au lecteur d'écran et avec retour sonore, mais n'a pas encore de retour haptique pour les personnes qui n'entendent pas les bips.",
                    "La liste d'appareils du scanner web se met à jour très souvent ; l'application est plus reposante avec un lecteur d'écran.",
                    "Certains textes explicatifs longs n'ont pas encore fait l'objet d'une relecture en langage clair.",
                ]},
                {"type": "h2", "text": "Signalez-nous ce qui ne fonctionne pas"},
                {"type": "p", "text": "Si une partie de GhostTooth vous est difficile ou impossible à utiliser, écrivez à <a href=\"mailto:" + SUPPORT_EMAIL + "\">" + SUPPORT_EMAIL + "</a> en décrivant ce qui s'est passé et ce que vous utilisiez. Les signalements d'accessibilité sont traités comme des bugs, pas comme des demandes d'évolution."},
            ],
        },
        "nl": {
            "title": "Toegankelijkheidsverklaring — GHOSTTOOTH",
            "og_title": "GHOSTTOOTH — Toegankelijkheidsverklaring",
            "heading": "Toegankelijkheidsverklaring",
            "description": "Hoe toegankelijk de GhostTooth-app en -website zijn, wat er is gedaan, wat nog niet goed genoeg is, en hoe je ons laat weten dat iets niet werkt.",
            "blocks": [
                {"type": "lede", "text": "Een veiligheidshulpmiddel dat maar voor sommige mensen werkt, is geen veiligheidshulpmiddel. Deze pagina zegt eerlijk waar GhostTooth staat, inclusief wat nog niet goed genoeg is."},
                {"type": "h2", "text": "Doel"},
                {"type": "p", "text": "We streven op deze website naar <strong>WCAG 2.1 niveau AA</strong>, en in de app naar de Android-richtlijnen voor toegankelijkheid. Er is geen formele externe audit uitgevoerd; dit is dus een zelfbeoordeling."},
                {"type": "h2", "text": "Wat er is geregeld"},
                {"type": "ul", "items": [
                    "Elke pagina is één bestand zonder externe lettertypen of scripts, dus hij laadt ook op een trage of geblokkeerde verbinding.",
                    "Donker en licht thema voldoen allebei aan AA-contrast; de site volgt je systeemvoorkeur in plaats van er één op te leggen.",
                    "Semantische landmarks, een logische kopstructuur en een 'naar de inhoud'-link op elke pagina.",
                    "Aanraakdoelen van minimaal 48 × 48 px in zowel de app als de site.",
                    "In de app hebben dreigingsbadges een gesproken omschrijving — een schermlezer meldt \"Surveillanceapparaat, bevestigde zekerheid\" in plaats van een gekleurd symbool voor te lezen.",
                    "Het dreigingsniveau wordt nooit alleen met kleur aangegeven: elke badge heeft ook een symbool en een woord.",
                    "Tekst schaalt mee met je systeemlettergrootte zonder weg te vallen.",
                ]},
                {"type": "h2", "text": "Bekende tekortkomingen"},
                {"type": "p", "text": "We noemen ze liever dan te doen alsof ze er niet zijn:"},
                {"type": "ul", "items": [
                    "De experimentele aanwezigheidstijdlijn in de app is een puur visuele grafiek zonder tekstueel alternatief.",
                    "De warm/koud-locator is bruikbaar met een schermlezer en met geluid, maar heeft nog geen trilpatroon voor wie het piepen niet hoort.",
                    "De apparaatlijst van de webscanner ververst vaak; met een schermlezer is de app rustiger in gebruik.",
                    "Sommige langere uitlegteksten zijn nog niet op begrijpelijke taal nagekeken.",
                ]},
                {"type": "h2", "text": "Laat het weten als iets niet werkt"},
                {"type": "p", "text": "Als een onderdeel van GhostTooth voor jou lastig of onmogelijk te gebruiken is, mail dan naar <a href=\"mailto:" + SUPPORT_EMAIL + "\">" + SUPPORT_EMAIL + "</a> met wat er gebeurde en wat je gebruikte. Toegankelijkheidsmeldingen behandelen we als bugs, niet als wensen."},
            ],
        },
    },
}

# ---------------------------------------------------------------------------
# /changelog/  (English only — a technical record)
# ---------------------------------------------------------------------------

CHANGELOG = {
    "updated": UPDATED,
    "langs": {
        "en": {
            "title": "Changelog — GHOSTTOOTH",
            "og_title": "GHOSTTOOTH — Changelog",
            "heading": "Changelog",
            "description": "What changed in each release of the GhostTooth Bluetooth tracker detector, including detection-definition updates.",
            "blocks": [
                {"type": "lede", "text": "What changed, when, and why. Detection-definition updates are listed too, because for a detector that is the part users actually care about."},
                {"type": "h2", "text": "1.6.0 — 18 August 2026"},
                {"type": "h3", "text": "Devices get named from their MAC address — carefully"},
                {"type": "ul", "items": [
                    "<strong>Hardware that broadcasts nothing identifying is now named from the IEEE manufacturer registry</strong> when its address is genuinely public, and shown as “Vendor (MAC)” so you can see where the name came from. On Android 15+ the Bluetooth controller itself says whether an address is real or randomised; on older versions only addresses that provably cannot be randomised are looked up. A randomised address never gets a name — inventing a manufacturer would be worse than saying nothing.",
                    "<strong>Devices found by background monitoring keep their manufacturer.</strong> They previously lost it on the way to the screen, which filed Apple Find My devices under “No manufacturer data” while their own description said Apple.",
                    "<strong>Anonymous devices stay anonymous, honestly.</strong> Many devices broadcast no name, no manufacturer and no services on a rotating address — that is Bluetooth privacy working, and no list anywhere can name them. GhostTooth watches whether they <em>travel with you</em> instead, which is the only signal that matters.",
                ]},
                {"type": "h3", "text": "Fixed"},
                {"type": "ul", "items": [
                    "<strong>Two false “Flock camera” sightings in a living room.</strong> A contract manufacturer's MAC range is no longer enough on its own to claim ALPR hardware — those builders also make everyday laptops, printers and TVs. The MAC range now only corroborates the actual Flock radio beacon.",
                    "<strong>A device no longer blinks in time with the refresh rate.</strong> Two causes: list rows re-animated on every update, and a device whose rotating addresses were merged could flip its identity on each refresh. Rows now update in place and merged identities stay put.",
                    "<strong>Clear now really clears.</strong> It also resets the background-monitoring store and the notification's counters, so the numbers on screen and in the notification can no longer drift apart — and cleared devices stop reappearing on the next app start.",
                    "The proximity locator and the experimental device probe now talk to the address a rotating device is actually using.",
                ]},
                {"type": "h3", "text": "New"},
                {"type": "ul", "items": [
                    "<strong>Report an issue from inside the app</strong> — an unrecognised device, a bug, a crash or a request. You see exactly what will be sent, nothing goes out until you confirm, and you get an anonymous tracking code to check for a reply. Crash reports can include the actual error, recorded on your device when it happened.",
                    "<strong>“Only show devices close to me”</strong> (experimental) declutters crowded places by hiding ordinary devices beyond a distance you choose. Trackers, surveillance devices, anything following you and your own marked devices are always shown, and searching always finds everything.",
                    "<strong>“Alert on every device found”</strong> (experimental) posts a silent notification for each new device background monitoring discovers.",
                    "A lifetime <strong>“devices seen since install”</strong> counter in Settings, and the collapsed screen keeps a small Start/Stop button. Tapping the GHOSTTOOTH title reopens the summary.",
                ]},
                {"type": "h2", "text": "1.5.1 — 16 August 2026"},
                {"type": "ul", "items": [
                    "<strong>Correct edge-to-edge display on Android 15 and 16.</strong> The platform libraries that draw behind the system bars were updated to the releases built for Android 15's enforced edge-to-edge, following Google Play's recommendation, so the app fills the whole screen properly on every device — including small ones, where the summary panel already collapses while you scroll.",
                    "<strong>Faster startup.</strong> The app now ships a compilation profile, so the code that runs when you open it — the scanner, the registries, the device list — is compiled ahead of time on every Android version instead of being interpreted on early launches.",
                    "Under the hood: Kotlin 2.2 and updated Room, Material and AndroidX libraries.",
                ]},
                {"type": "h2", "text": "1.5.0 — 15 August 2026"},
                {"type": "h3", "text": "New"},
                {"type": "ul", "items": [
                    "<strong>Devices are named from their MAC address.</strong> A new registry carries all 53,000 IEEE manufacturer assignments, so hardware whose Bluetooth data says nothing — an ESP32 module, a camera, a no-name tag — is still identified when it uses a public address. Randomised addresses, which most phones and trackers use precisely so they cannot be followed, are never looked up: those bytes are generated, not assigned, and naming a vendor from them would be invention. The registry ships inside the app and works fully offline.",
                    "<strong>Alert list.</strong> Long-press any device and choose “Alert me when seen” to be notified whenever it turns up, whoever made it and whatever it is. Alert devices carry a bell and their own colour, re-alert only after they have been away a while, and can be muted for 30 minutes, 1, 8 or 24 hours without being forgotten. The list is managed from Settings.",
                    "<strong>The Notable tab is now yours to edit.</strong> Remove a device permanently — it never comes back on its own — or add one by hand. An optional notification tells you when something newly qualifies for the tab.",
                    "<strong>Copy MAC address</strong> from the long-press menu, for looking a device up elsewhere.",
                    "<strong>Reset all settings</strong>, at the bottom of Settings. Notes, Notable choices and the alert list are kept, and no scan history is touched.",
                ]},
                {"type": "h3", "text": "Changed"},
                {"type": "ul", "items": [
                    "<strong>The summary panel collapses while you scroll</strong>, giving small screens the whole display for the device list. A small arrow brings it back, and returning to the top of the list does too.",
                    "New installations sort by name. Together with the existing grouping and collapsing defaults, the first scan reads as a tidy inventory rather than a churning feed.",
                ]},
                {"type": "h3", "text": "Fixed"},
                {"type": "ul", "items": [
                    "Two notifications about different devices could previously overwrite each other; every alert kind now has its own slot per device.",
                    "Resetting settings while background monitoring ran could leave the scan running with the switch showing off. The scan is now stopped first.",
                ]},
                {"type": "h2", "text": "1.4.2 — 13 August 2026"},
                {"type": "p", "text": "The releases between 1.3.1 and this one went to testers only, so everything they contained is listed here."},
                {"type": "h3", "text": "Fixed"},
                {"type": "ul", "items": [
                    "<strong>The app could crash the moment you pressed Start scan.</strong> On Android 14 and later only. Two internal text-matching patterns were written in a form the older Android text engine tolerated and the newer one rejects outright. Nothing was wrong with your phone, and no data was lost.",
                    "<strong>JBL speakers were reported as surveillance devices.</strong> Bluetooth company ID <code>0x0057</code> was labelled as a smart-glasses maker in our tables. It actually belongs to Harman, the maker of JBL audio gear; the glasses maker is <code>0x060C</code>. Corrected.",
                    "<strong>Apple devices no longer flip between “tracker” and ordinary.</strong> Trackers rotate their Bluetooth address to avoid being followed, so GhostTooth stitches those identities back together. It was taking the verdict from whichever frame arrived last, and Apple hardware alternates between two kinds of frame. It now keeps the strongest verdict it has seen.",
                    "<strong>The locator now really does beep faster as you close in.</strong> The beeping was tied to the scan refresh, which is slower than the fastest beep interval, so the acceleration you were promised could never happen.",
                    "<strong>“Check for new definitions” always failed.</strong> The published checksums were generated from files saved with Windows line endings while the server sends Unix ones, so every download failed its integrity check and was discarded — correctly, but for the wrong reason. Definition updates work again.",
                ]},
                {"type": "h3", "text": "New"},
                {"type": "ul", "items": [
                    "<strong>A Notable tab.</strong> One place for the findings that actually warrant a look — something travelling with you, surveillance hardware close by — instead of scrolling a list of everything in range. You choose what qualifies, including how near counts as near.",
                    "<strong>Distances in metres or feet.</strong>",
                    "<strong>Alerts for particular kinds of device.</strong> Ask to be told when a camera, a microphone or a tag appears, without being told about everything else.",
                    "<strong>Automatic licence-plate-reader (ALPR) camera detection.</strong> GhostTooth recognises the Bluetooth signature of Flock Safety camera hardware. The radio module and the manufacturing MAC ranges this hardware uses are also sold to other companies, so a match on those alone is reported as <em>possible</em> and never raises an alarm — only the vendor's own name, or two independent signals together, counts as a firm finding. Published prefix lists were checked against the official IEEE registry first, and the entries belonging to mass-market parts were discarded rather than copied.",
                    "<strong>Optional automatic definition checks.</strong> Off unless you turn it on, and it asks once.",
                ]},
                {"type": "h3", "text": "Changed"},
                {"type": "ul", "items": [
                    "New installations now start grouped by manufacturer and collapsed, which is far easier to read in a busy place. Existing settings are untouched.",
                    "Built for Android 16.",
                ]},
                {"type": "h2", "text": "1.3.1 — 30 July 2026"},
                {"type": "ul", "items": [
                    "<strong>Nearby phones no longer inflate the tracker count.</strong> An Apple device sitting beside its owner broadcasts the same Find My frame whether it is an iPhone or a tag, so it is still listed — as a <em>possible</em> match that says in plain words it is most likely simply someone's phone. What changed is that weak matches like these are no longer counted in the headline “trackers” number and never raise an alarm. The number now only ever counts firm matches.",
                    "<strong>Samsung Find on a Samsung device is now “possible”, not “likely”.</strong> Galaxy phones, watches and earbuds take part in Samsung Find too, not only SmartTags.",
                    "<strong>You choose how readily something counts as travelling with you.</strong> Three settings, because only you know your situation: <em>fewer alerts</em> if you are around the same people every day, <em>balanced</em>, or <em>more alerts</em> if you are usually alone. The alert now also requires the device to have been genuinely close by, not merely somewhere within Bluetooth range.",
                    "<strong>Your history is safe across updates.</strong> The sighting timeline could previously have been wiped by a routine app update. It cannot be any more.",
                    "<strong>Hostile device names can no longer cause trouble.</strong> Device names come off the air and can contain anything at all. They are now length-limited and stripped of hidden characters that could disguise what you are reading, and the downloaded detection definitions are size-capped and screened.",
                    "<strong>The locator now vibrates as well as beeps</strong>, so it works when you cannot hear it or cannot make a sound.",
                    "<strong>Every explanation is now translated.</strong> The app was already in English, French and Dutch, but the sentence explaining <em>why</em> a device was flagged was always written in English, as were the device-type guesses and the “why is monitoring not working” panel. All of it now follows your phone's language — including findings that were already saved, and the CSV you export.",
                    "<strong>“Tile” in a device name is no longer enough on its own</strong> — it is an ordinary English word and appeared in smart-home product names.",
                ]},
                {"type": "h2", "text": "1.3.0 — 28 July 2026"},
                {"type": "h3", "text": "Detection accuracy — the big one"},
                {"type": "ul", "items": [
                    "<strong>Apple and Samsung devices are no longer flagged from the maker ID alone.</strong> Classification previously keyed off the manufacturer company ID, and <code>0x004C</code> is broadcast by every iPhone, iPad, Mac, Apple Watch and set of AirPods ever made. A train carriage produced a screen full of red badges. GhostTooth now decodes the Apple payload and distinguishes an accessory that is <em>separated from its owner</em> — what an unwanted tracker looks like — from an ordinary Apple device beside its owner.",
                    "<strong>Google Find My Device Network detection.</strong> Chipolo, Pebblebee, Moto Tag and the rest of the fastest-growing tracker ecosystem are now recognised from their broadcast frames — including the frame a tag sends once it has been <em>separated from its owner</em> and has stopped rotating its address so that detectors can find it. That is the exact signal an unwanted tag gives off, and it is the one that matters most.",
                    "<strong>Eddystone beacons are no longer trackers.</strong> Google's tracker network shares a service UUID with ordinary retail beacons, so every shop display used to be a false positive. Decided by frame type now.",
                    "<strong>Samsung SmartTag</strong> is detected via the Samsung Find service rather than the Samsung company ID.",
                    "<strong>Confidence levels.</strong> Every finding is now rated Possible, Likely or Confirmed, and says in plain language what that means. Weak evidence is never enough on its own to raise an alarm, and from 1.3.1 it is not counted in the headline totals either — it is shown in the list with its explanation.",
                    "<strong>Unidentified-tracker heuristic.</strong> An anonymous device with no name and no vendor that stays with you across several separate time windows is now surfaced, which is the only way to catch cheap unbranded tags.",
                    "<strong>Far more known devices</strong>: wearable AI recorders, camera glasses, body cameras, and a much wider range of tracking tags.",
                ]},
                {"type": "h3", "text": "New"},
                {"type": "ul", "items": [
                    "<strong>Safety guidance.</strong> A dedicated, fully offline screen explaining what to do if you find a tracker — preserve evidence, stay safe, rule out innocent explanations, get real support. Reachable from the follow alert itself.",
                    "<strong>Hot/cold locator.</strong> Long-press any device to open a full-screen proximity finder with a large signal reading and audio feedback that speeds up as you get closer.",
                    "<strong>Definition freshness.</strong> Advanced settings now show how old your detection definitions are and let you force a check. Failed updates are no longer silent.",
                ]},
                {"type": "h3", "text": "Changed"},
                {"type": "ul", "items": [
                    "Scan power now defaults to <em>Balanced</em> rather than <em>High accuracy</em>, which noticeably reduces battery use. High accuracy is still one tap away, and the locator screen switches to it automatically.",
                    "CSV exports from the app and the web scanner now share one schema, with ISO-8601 timestamps, so a file from either can be compared directly.",
                    "The battery-optimisation helper is now a permanent settings row instead of a one-time dialog you could never get back.",
                    "Threat notifications are ranked by evidence strength as well as severity.",
                ]},
                {"type": "h3", "text": "Accessibility"},
                {"type": "ul", "items": [
                    "Threat badges now carry spoken descriptions for screen readers, so the most important fact about a device is no longer conveyed by a coloured symbol alone.",
                    "Device cards announce name, verdict, confidence and signal in a single summary.",
                ]},
                {"type": "h3", "text": "Security"},
                {"type": "ul", "items": [
                    "CSV exports are now hardened against spreadsheet formula injection. A BLE device name is entirely attacker-controlled, and a name like <code>=cmd|…</code> could previously be evaluated by Excel when the export was opened.",
                    "Detection definitions are verified against a published SHA-256 before use, so a truncated or tampered download is discarded rather than silently reducing what the app can see.",
                    "Definition updates now only download files that actually changed.",
                ]},
                {"type": "h2", "text": "1.2.0"},
                {"type": "ul", "items": [
                    "Background monitoring rebuilt without a foreground service, using the system-held scan API plus a WorkManager watchdog.",
                    "Ongoing notification with live device, surveillance and tracker counts that survive the app being closed.",
                    "\"Travelling with you\" follow detection, home-screen widget, Quick Settings tile, and a background self-test for diagnosing OEM battery killers.",
                ]},
                {"type": "h2", "text": "Detection definitions"},
                {"type": "p", "text": "The app checks for updated definitions roughly every 12 hours and applies them without needing an app update. Current definitions and their checksums are published at <code>/media/registry-index.json</code>."},
                {"type": "card", "variant": "ok", "title": "Know a device we should recognise?", "text": "If you have found a tracker or recording device GhostTooth does not flag, tell us what it advertises and we will add it — usually within a day, and it reaches every installed app without an update. <a href=\"mailto:" + SUPPORT_EMAIL + "\">" + SUPPORT_EMAIL + "</a>"},
            ],
        },
    },
}

# ---------------------------------------------------------------------------
# Localised landing pages (/fr/, /nl/). The English landing page is the
# hand-written scanner at the site root and is not generated.
# ---------------------------------------------------------------------------

LANDING = {
    "updated": UPDATED,
    "langs": {
        "fr": {
            "title": "GHOSTTOOTH — Détecteur de traceurs et d'appareils de surveillance Bluetooth",
            "og_title": "GHOSTTOOTH — Détecteur de traceurs Bluetooth",
            "heading": "Détectez les traceurs et les appareils de surveillance autour de vous",
            "description": "GhostTooth repère les traceurs Bluetooth (AirTag, Tile, SmartTag, Find My Device) et les appareils d'enregistrement à proximité. Gratuit, sans publicité, sans collecte de données, fonctionne hors ligne.",
            "blocks": [
                {"type": "lede", "text": "GhostTooth écoute les trames Bluetooth autour de vous et signale ce qui ressemble à un traceur ou à du matériel d'enregistrement. Gratuit, sans publicité, sans compte, et <strong>aucune donnée ne quitte votre téléphone</strong>."},
                {"type": "buttons", "items": [
                    {"href": PLAY_URL, "label": "Télécharger sur Google Play", "primary": True, "external": True},
                    {"href": "{root}", "label": "Scanner depuis le navigateur"},
                ]},
                {"type": "shots", "items": SCREENSHOTS["fr"]},
                {"type": "h2", "text": "Ce qu'il détecte"},
                {"type": "ul", "items": [
                    "<strong>Traceurs</strong> : AirTag et accessoires Find My d'Apple, Tile, Samsung SmartTag, Chipolo, Pebblebee, Moto Tag et les balises du réseau Find My Device de Google.",
                    "<strong>Appareils de surveillance</strong> : lunettes à caméra (Ray-Ban Meta, Snap Spectacles, Echo Frames), enregistreurs portables et pins IA, caméras-piétons.",
                    "<strong>Balises anonymes</strong> qui restent avec vous sur plusieurs créneaux horaires distincts, même sans marque reconnaissable.",
                ]},
                {"type": "h2", "text": "Chaque verdict s'explique"},
                {"type": "p", "text": "Un badge rouge sans explication n'aide personne. GhostTooth indique pourquoi un appareil est signalé et à quel point la preuve est solide : <em>possible</em> (un seul indice faible), <em>probable</em> (confirmé par le fabricant ou le service annoncé) ou <em>confirmé</em> (lu directement dans le protocole de suivi). Seules les preuves solides déclenchent une alerte."},
                {"type": "h2", "text": "Surveillance en arrière-plan"},
                {"type": "p", "text": "Activez la surveillance et GhostTooth continue de chercher quand l'application est fermée, avec une notification qui affiche les compteurs en direct. Il vous prévient quand un appareil <em>voyage avec vous</em> — le signal qui compte vraiment."},
                {"type": "h2", "text": "Vie privée"},
                {"type": "p", "text": "Aucune donnée d'analyse, aucune donnée personnelle, aucune position ne quitte votre appareil. Aucune publicité, aucun traceur, aucun compte. La seule connexion réseau sert à télécharger les définitions de détection depuis ce site. Voir la <a href=\"{root}fr/privacy/\">politique de confidentialité</a>."},
                {"type": "h2", "text": "Vous avez trouvé quelque chose ?"},
                {"type": "card", "variant": "warn", "text": "Ne le jetez pas tout de suite : c'est une preuve. Notre <a href=\"{root}fr/safety/\">guide de sécurité</a> explique quoi faire, quoi éviter, et où trouver de l'aide."},
                {"type": "buttons", "items": [
                    {"href": "{root}fr/faq/", "label": "Aide & FAQ"},
                    {"href": "{root}fr/safety/", "label": "Traceur trouvé ?"},
                ]},
            ],
        },
        "nl": {
            "title": "GHOSTTOOTH — Bluetooth-tracker- en surveillancedetector",
            "og_title": "GHOSTTOOTH — Bluetooth-trackerdetector",
            "heading": "Vind trackers en surveillanceapparaten in je omgeving",
            "description": "GhostTooth spoort bluetooth-trackers op (AirTag, Tile, SmartTag, Find My Device) en opnameapparatuur in de buurt. Gratis, zonder advertenties, zonder dataverzameling, werkt offline.",
            "blocks": [
                {"type": "lede", "text": "GhostTooth luistert naar de bluetooth-berichten om je heen en markeert wat op een tracker of opnameapparaat lijkt. Gratis, zonder advertenties, zonder account, en <strong>er verlaat geen enkel gegeven je telefoon</strong>."},
                {"type": "buttons", "items": [
                    {"href": PLAY_URL, "label": "Downloaden in Google Play", "primary": True, "external": True},
                    {"href": "{root}", "label": "Scannen in de browser"},
                ]},
                {"type": "shots", "items": SCREENSHOTS["nl"]},
                {"type": "h2", "text": "Wat het vindt"},
                {"type": "ul", "items": [
                    "<strong>Trackers</strong>: Apple AirTag en Find My-accessoires, Tile, Samsung SmartTag, Chipolo, Pebblebee, Moto Tag en tags van het Google Find My Device-netwerk.",
                    "<strong>Surveillanceapparatuur</strong>: camerabrillen (Ray-Ban Meta, Snap Spectacles, Echo Frames), draagbare recorders en AI-pins, bodycams.",
                    "<strong>Anonieme bakens</strong> die over meerdere losse tijdvakken bij je blijven, ook zonder herkenbaar merk.",
                ]},
                {"type": "h2", "text": "Elk oordeel legt zichzelf uit"},
                {"type": "p", "text": "Een rode badge zonder uitleg helpt niemand. GhostTooth vertelt waarom een apparaat is gemarkeerd en hoe sterk het bewijs is: <em>mogelijk</em> (één zwakke aanwijzing), <em>waarschijnlijk</em> (bevestigd door de fabrikant of de aangekondigde service) of <em>bevestigd</em> (rechtstreeks uit het volgprotocol gelezen). Alleen sterk bewijs geeft een melding."},
                {"type": "h2", "text": "Monitoring op de achtergrond"},
                {"type": "p", "text": "Zet monitoring aan en GhostTooth blijft zoeken als de app dicht is, met een melding die de tellers live bijhoudt. Je krijgt bericht wanneer een apparaat <em>met je meereist</em> — het signaal dat er echt toe doet."},
                {"type": "h2", "text": "Privacy"},
                {"type": "p", "text": "Er verlaten geen scangegevens, persoonsgegevens of locatiegegevens je toestel. Geen advertenties, geen trackers, geen account. De enige netwerkverbinding haalt de detectiedefinities van deze site. Zie het <a href=\"{root}nl/privacy/\">privacybeleid</a>."},
                {"type": "h2", "text": "Iets gevonden?"},
                {"type": "card", "variant": "warn", "text": "Gooi het niet meteen weg: het is bewijs. Onze <a href=\"{root}nl/safety/\">veiligheidsgids</a> legt uit wat je wel en niet moet doen, en waar je hulp vindt."},
                {"type": "buttons", "items": [
                    {"href": "{root}nl/faq/", "label": "Help & FAQ"},
                    {"href": "{root}nl/safety/", "label": "Tracker gevonden?"},
                ]},
            ],
        },
    },
}

# ---------------------------------------------------------------------------
# Localised FAQ (/fr/faq/, /nl/faq/). The English FAQ is hand-written.
# ---------------------------------------------------------------------------

FAQ = {
    "updated": UPDATED,
    "langs": {
        "fr": {
            "title": "Aide & FAQ — GHOSTTOOTH",
            "og_title": "GHOSTTOOTH — Aide & FAQ",
            "heading": "Aide & questions fréquentes",
            "description": "Comment fonctionne GhostTooth, comment lire les résultats, pourquoi la détection à 100 % est impossible, et comment résoudre les problèmes d'analyse.",
            "blocks": [
                {"type": "lede", "text": "Comment GhostTooth fonctionne, comment lire ce qu'il affiche et — tout aussi important — ce qu'il ne peut honnêtement pas voir."},
                {"type": "h2", "text": "Qu'est-ce que GhostTooth ?"},
                {"type": "p", "text": "Un scanner Bluetooth Low Energy. Les appareils BLE diffusent en permanence de petits paquets d'annonce pour se faire connaître. GhostTooth écoute ces paquets et compare ce qu'ils contiennent à une base d'appareils connus. Il ne se connecte à rien et ne s'appaire avec rien : il écoute uniquement."},
                {"type": "h2", "text": "Comment lire un résultat"},
                {"type": "table", "head": ["Champ", "Signification"], "rows": [
                    ["Nom", "Le nom que l'appareil diffuse. Il est librement modifiable et souvent absent."],
                    ["MAC", "L'adresse Bluetooth. Beaucoup d'appareils la font tourner toutes les 15 minutes pour préserver la vie privée."],
                    ["RSSI", "La force du signal en dBm. Plus proche de zéro = plus fort. −40 est très proche, −100 est à la limite de portée."],
                    ["Distance", "Une estimation grossière déduite du RSSI. Les murs, les corps et l'orientation de l'antenne provoquent facilement un facteur d'erreur de 2 à 5."],
                    ["Fabricant", "L'identifiant d'entreprise Bluetooth SIG déclaré. Attention : beaucoup d'appareils annoncent l'identifiant du fabricant de la puce, pas celui du produit."],
                    ["Raison", "Pourquoi GhostTooth a signalé cet appareil."],
                    ["Confiance", "La solidité de la preuve : possible, probable ou confirmée."],
                ]},
                {"type": "h2", "text": "Que signifient les niveaux de confiance ?"},
                {"type": "ul", "items": [
                    "<strong>Possible</strong> — un seul indice faible, par exemple un nom contenant « tile », ou un appareil Apple ou Samsung à côté de son propriétaire. Ces appareils apparaissent dans la liste avec leur explication, mais ne sont <em>pas</em> comptés dans le total des traceurs et ne déclenchent d'alerte que s'ils vous suivent durablement.",
                    "<strong>Probable</strong> — confirmé par un fabricant qui ne produit que des traceurs, ou par le service annoncé.",
                    "<strong>Confirmé</strong> — lu directement dans le protocole de suivi, par exemple une balise Find My d'Apple diffusant en mode séparé.",
                ]},
                {"type": "h2", "text": "Pourquoi mon iPhone n'est-il pas signalé comme traceur ?"},
                {"type": "p", "text": "Parce qu'il n'en est pas un. L'identifiant Bluetooth <code>0x004C</code> appartient à Apple et se retrouve sur chaque iPhone, Mac, Apple Watch et paire d'AirPods. Les versions antérieures de GhostTooth signalaient tout appareil portant cet identifiant, ce qui remplissait l'écran de fausses alertes dans n'importe quel lieu public. GhostTooth décode désormais le contenu réel de la trame et ne signale qu'une véritable balise Find My — en particulier celle d'un accessoire <em>séparé de son propriétaire</em>, ce à quoi ressemble un traceur indésirable."},
                {"type": "h2", "text": "Pourquoi la détection à 100 % est impossible"},
                {"type": "card", "variant": "warn", "text": "Aucun outil Bluetooth ne peut garantir de tout trouver. Un appareil éteint, déchargé, enfermé dans du métal, qui n'utilise pas le Bluetooth (GPS/GSM), qui ne se réveille qu'occasionnellement ou dont le modèle est absent de notre base ne sera pas détecté. Une analyse vierge n'est <strong>pas</strong> la preuve qu'il n'y a rien."},
                {"type": "h2", "text": "Autorisations"},
                {"type": "ul", "items": [
                    "<strong>Appareils à proximité</strong> — obligatoire pour recevoir les trames BLE. GhostTooth la déclare avec <code>neverForLocation</code> : il n'en déduit aucune position.",
                    "<strong>Notifications</strong> — uniquement pour la notification de surveillance et les alertes. Ce sont des notifications ordinaires, pas un service au premier plan.",
                    "<strong>Démarrage au redémarrage</strong> — pour réactiver la surveillance après un redémarrage, si vous l'aviez activée.",
                    "Sur Android 11 et antérieur, le système exigeait l'autorisation de localisation pour toute analyse BLE. C'est une contrainte d'Android, pas un choix de GhostTooth.",
                ]},
                {"type": "h2", "text": "La surveillance en arrière-plan ne fonctionne pas"},
                {"type": "p", "text": "C'est presque toujours la gestion agressive de la batterie du constructeur (Xiaomi, Huawei, Samsung, OnePlus, Oppo). Dans <em>Paramètres avancés</em>, lancez l'<strong>autotest en arrière-plan</strong> : il arme une analyse et attend un vrai résultat, ce qui prouve si votre téléphone livre les données quand l'application est fermée. Si ce n'est pas le cas, utilisez le bouton « Fiabiliser la surveillance » pour exclure GhostTooth de l'optimisation de la batterie."},
                {"type": "h2", "text": "Comment retrouver physiquement un appareil ?"},
                {"type": "p", "text": "Appuyez longuement sur l'appareil et choisissez <em>Localiser cet appareil</em>. Voir aussi le <a href=\"{root}fr/safety/\">guide de sécurité</a>, qui explique quoi faire une fois l'appareil trouvé."},
                {"type": "h2", "text": "Confidentialité"},
                {"type": "p", "text": "Tout le traitement est local. Aucun résultat d'analyse ne quitte votre téléphone. La seule connexion réseau télécharge les définitions de détection depuis ce site. Détails dans la <a href=\"{root}fr/privacy/\">politique de confidentialité</a>."},
                {"type": "h2", "text": "Usage légal et éthique"},
                {"type": "p", "text": "GhostTooth est destiné à vérifier votre propre personne, vos affaires et votre véhicule. L'utiliser pour suivre ou surveiller autrui est illégal dans la plupart des pays et contraire à l'objectif de l'outil. Voir les <a href=\"{root}fr/terms/\">conditions d'utilisation</a>."},
                {"type": "buttons", "items": [
                    {"href": PLAY_URL, "label": "Télécharger sur Google Play", "primary": True, "external": True},
                    {"href": "{root}fr/safety/", "label": "Vous avez trouvé un traceur ?"},
                ]},
            ],
        },
        "nl": {
            "title": "Help & FAQ — GHOSTTOOTH",
            "og_title": "GHOSTTOOTH — Help & FAQ",
            "heading": "Help & veelgestelde vragen",
            "description": "Hoe GhostTooth werkt, hoe je de resultaten leest, waarom 100% detectie onmogelijk is, en hoe je scanproblemen oplost.",
            "blocks": [
                {"type": "lede", "text": "Hoe GhostTooth werkt, hoe je leest wat het laat zien en — net zo belangrijk — wat het eerlijk gezegd niet kan zien."},
                {"type": "h2", "text": "Wat is GhostTooth?"},
                {"type": "p", "text": "Een Bluetooth Low Energy-scanner. BLE-apparaten zenden continu kleine advertentiepakketjes uit om zich kenbaar te maken. GhostTooth luistert naar die pakketjes en vergelijkt de inhoud met een database van bekende apparaten. Het maakt nooit verbinding en koppelt nooit: het luistert alleen."},
                {"type": "h2", "text": "Hoe lees je een resultaat?"},
                {"type": "table", "head": ["Veld", "Betekenis"], "rows": [
                    ["Naam", "De naam die het apparaat uitzendt. Vrij instelbaar en vaak afwezig."],
                    ["MAC", "Het bluetooth-adres. Veel apparaten wisselen dit elke 15 minuten voor de privacy."],
                    ["RSSI", "Signaalsterkte in dBm. Dichter bij nul = sterker. −40 is heel dichtbij, −100 is de rand van het bereik."],
                    ["Afstand", "Een ruwe schatting op basis van RSSI. Muren, lichamen en antennerichting zorgen makkelijk voor een factor 2 tot 5 afwijking."],
                    ["Fabrikant", "De opgegeven Bluetooth SIG-bedrijfscode. Let op: veel apparaten zenden de code van de chipfabrikant uit, niet die van het product."],
                    ["Reden", "Waarom GhostTooth dit apparaat heeft gemarkeerd."],
                    ["Zekerheid", "Hoe sterk het bewijs is: mogelijk, waarschijnlijk of bevestigd."],
                ]},
                {"type": "h2", "text": "Wat betekenen de zekerheidsniveaus?"},
                {"type": "ul", "items": [
                    "<strong>Mogelijk</strong> — één zwakke aanwijzing, bijvoorbeeld een naam met 'tile' erin, of een Apple- of Samsung-apparaat naast zijn eigenaar. Die apparaten staan met uitleg in de lijst, maar tellen <em>niet</em> mee in het totaal aantal trackers en geven alleen een melding als ze ook langere tijd met u meereizen.",
                    "<strong>Waarschijnlijk</strong> — bevestigd door een fabrikant die alleen trackers maakt, of door de aangekondigde service.",
                    "<strong>Bevestigd</strong> — rechtstreeks uit het volgprotocol gelezen, bijvoorbeeld een Apple Find My-baken dat in gescheiden toestand uitzendt.",
                ]},
                {"type": "h2", "text": "Waarom wordt mijn iPhone niet als tracker gemarkeerd?"},
                {"type": "p", "text": "Omdat het er geen is. Bluetooth-code <code>0x004C</code> is van Apple en zit op elke iPhone, Mac, Apple Watch en set AirPods. Oudere versies van GhostTooth markeerden alles met die code, waardoor het scherm in elke openbare ruimte vol stond met valse meldingen. GhostTooth decodeert nu de werkelijke inhoud van het bericht en markeert alleen een echt Find My-baken — met name dat van een accessoire dat <em>gescheiden is van zijn eigenaar</em>, wat precies is hoe een ongewenste tracker eruitziet."},
                {"type": "h2", "text": "Waarom 100% detectie onmogelijk is"},
                {"type": "card", "variant": "warn", "text": "Geen enkel bluetooth-hulpmiddel kan garanderen dat het alles vindt. Een apparaat dat uit staat, leeg is, in metaal is weggewerkt, geen bluetooth gebruikt (GPS/GSM), maar af en toe wakker wordt, of waarvan het model niet in onze database staat, wordt niet gevonden. Een schone scan is <strong>geen</strong> bewijs dat er niets is."},
                {"type": "h2", "text": "Machtigingen"},
                {"type": "ul", "items": [
                    "<strong>Apparaten in de buurt</strong> — nodig om BLE-berichten te ontvangen. GhostTooth vraagt die met <code>neverForLocation</code>: er wordt geen locatie uit afgeleid.",
                    "<strong>Meldingen</strong> — alleen voor de monitoringmelding en waarschuwingen. Dat zijn gewone meldingen, geen foreground service.",
                    "<strong>Starten bij opstarten</strong> — om monitoring na een herstart weer aan te zetten als je die had ingeschakeld.",
                    "Op Android 11 en ouder eiste het systeem locatietoestemming voor elke BLE-scan. Dat is een beperking van Android, geen keuze van GhostTooth.",
                ]},
                {"type": "h2", "text": "Monitoring op de achtergrond werkt niet"},
                {"type": "p", "text": "Dat is bijna altijd het agressieve batterijbeheer van de fabrikant (Xiaomi, Huawei, Samsung, OnePlus, Oppo). Voer bij <em>Geavanceerde instellingen</em> de <strong>zelftest op de achtergrond</strong> uit: die zet een scan op en wacht op een echt resultaat, zodat je ziet of je toestel gegevens levert terwijl de app dicht is. Zo niet, gebruik dan de knop 'Monitoring betrouwbaar houden' om GhostTooth uit te sluiten van batterijoptimalisatie."},
                {"type": "h2", "text": "Hoe vind ik een apparaat fysiek terug?"},
                {"type": "p", "text": "Houd het apparaat ingedrukt en kies <em>Dit apparaat lokaliseren</em>. Zie ook de <a href=\"{root}nl/safety/\">veiligheidsgids</a>, die uitlegt wat je doet zodra je het gevonden hebt."},
                {"type": "h2", "text": "Privacy"},
                {"type": "p", "text": "Alle verwerking gebeurt lokaal. Er verlaten geen scanresultaten je telefoon. De enige netwerkverbinding haalt de detectiedefinities van deze site. Details in het <a href=\"{root}nl/privacy/\">privacybeleid</a>."},
                {"type": "h2", "text": "Legaal en ethisch gebruik"},
                {"type": "p", "text": "GhostTooth is bedoeld om jezelf, je spullen en je voertuig te controleren. Het gebruiken om iemand anders te volgen of te bespioneren is in de meeste landen illegaal en gaat in tegen het doel van dit hulpmiddel. Zie de <a href=\"{root}nl/terms/\">gebruiksvoorwaarden</a>."},
                {"type": "buttons", "items": [
                    {"href": PLAY_URL, "label": "Downloaden in Google Play", "primary": True, "external": True},
                    {"href": "{root}nl/safety/", "label": "Een tracker gevonden?"},
                ]},
            ],
        },
    },
}

# ---------------------------------------------------------------------------
# Localised privacy policy (/fr/privacy/, /nl/privacy/).
# ---------------------------------------------------------------------------

PRIVACY = {
    "updated": UPDATED,
    "langs": {
        "fr": {
            "title": "Politique de confidentialité — GHOSTTOOTH",
            "og_title": "GHOSTTOOTH — Politique de confidentialité",
            "heading": "Politique de confidentialité",
            "description": "GhostTooth ne collecte, ne stocke et ne partage aucune donnée personnelle. Tout le traitement est local et l'application fonctionne hors ligne.",
            "blocks": [
                {"type": "card", "variant": "ok", "title": "En bref", "text": "Aucune collecte de données. Aucun compte. Aucune publicité. Aucun outil d'analyse. Aucun résultat d'analyse ne quitte votre appareil. La seule connexion réseau télécharge des définitions de détection publiques depuis ce site."},
                {"type": "h2", "text": "1. Ce que nous ne collectons pas"},
                {"type": "p", "text": "Nous ne collectons, ne stockons ni ne transmettons : les appareils que vous détectez, les adresses MAC, les noms d'appareils, votre position, votre identifiant publicitaire, votre adresse e-mail, vos contacts, ni aucune statistique d'utilisation. Il n'y a pas de serveur qui recevrait ces données."},
                {"type": "h2", "text": "2. Ce qui reste sur votre appareil"},
                {"type": "p", "text": "Les appareils détectés, vos notes, les appareils que vous avez masqués et l'historique de surveillance sont enregistrés dans le stockage interne privé de l'application. Ils sont supprimés lorsque vous videz la liste, effacez les données de l'application ou la désinstallez."},
                {"type": "h2", "text": "3. Activité réseau"},
                {"type": "p", "text": "L'application télécharge périodiquement les définitions de détection depuis <code>ghosttooth.labidi.eu</code>. Comme pour toute requête web, notre hébergeur voit l'adresse IP publique qui la formule. Nous n'établissons pas de profil et ne relions cette requête à rien. Aucun résultat d'analyse n'est envoyé — la requête est en lecture seule."},
                {"type": "p", "text": "L'application propose un épinglage de certificat facultatif pour cette connexion. Il est désactivé par défaut car un renouvellement légitime de certificat interromprait les mises à jour ; il est utile si vous craignez une interception."},
                {"type": "h2", "text": "4. Fonctionnement hors ligne"},
                {"type": "p", "text": "Toutes les fonctions de détection marchent sans connexion. Les définitions fournies avec l'application servent tant qu'aucune mise à jour n'a été téléchargée."},
                {"type": "h2", "text": "5. Autorisations"},
                {"type": "table", "head": ["Autorisation", "Pourquoi"], "rows": [
                    ["Appareils à proximité (BLUETOOTH_SCAN)", "Recevoir les trames BLE. Déclarée <code>neverForLocation</code> : aucune position n'en est déduite."],
                    ["BLUETOOTH_CONNECT", "Uniquement à la demande, pour la sonde GATT expérimentale et facultative."],
                    ["Notifications", "Notification de surveillance et alertes. Notifications ordinaires, pas de service au premier plan."],
                    ["Démarrage au redémarrage", "Réactiver la surveillance après un redémarrage si vous l'aviez activée."],
                    ["Internet", "Uniquement pour télécharger les définitions de détection."],
                ]},
                {"type": "h2", "text": "6. Tiers"},
                {"type": "p", "text": "Aucun SDK tiers, aucun réseau publicitaire, aucun outil de mesure d'audience, aucun rapport de plantage. Rien n'est partagé avec personne."},
                {"type": "h2", "text": "7. Enfants"},
                {"type": "p", "text": "Nous ne collectons de données de personne, quel que soit son âge."},
                {"type": "h2", "text": "8. Vos droits (RGPD)"},
                {"type": "p", "text": "Les droits d'accès, de rectification et d'effacement portent sur des données que nous détiendrions. Nous n'en détenons aucune : il n'y a rien à consulter, exporter ou supprimer de notre côté. Les données présentes sur votre appareil vous appartiennent et vous pouvez les effacer à tout moment depuis l'application."},
                {"type": "h2", "text": "9. Modifications"},
                {"type": "p", "text": "Les modifications de cette politique seront publiées ici et notées dans le <a href=\"{root}changelog/\">journal des versions</a>."},
                {"type": "h2", "text": "10. Contact"},
                {"type": "p", "text": "Questions : <a href=\"mailto:" + SUPPORT_EMAIL + "\">" + SUPPORT_EMAIL + "</a>. Signalements de sécurité : <a href=\"mailto:" + SECURITY_EMAIL + "\">" + SECURITY_EMAIL + "</a>."},
            ],
        },
        "nl": {
            "title": "Privacybeleid — GHOSTTOOTH",
            "og_title": "GHOSTTOOTH — Privacybeleid",
            "heading": "Privacybeleid",
            "description": "GhostTooth verzamelt, bewaart en deelt geen persoonsgegevens. Alle verwerking gebeurt lokaal en de app werkt offline.",
            "blocks": [
                {"type": "card", "variant": "ok", "title": "In het kort", "text": "Geen dataverzameling. Geen account. Geen advertenties. Geen analytics. Er verlaten geen scanresultaten je toestel. De enige netwerkverbinding haalt openbare detectiedefinities van deze site."},
                {"type": "h2", "text": "1. Wat we niet verzamelen"},
                {"type": "p", "text": "We verzamelen, bewaren en versturen niet: welke apparaten je detecteert, MAC-adressen, apparaatnamen, je locatie, je advertentie-ID, je e-mailadres, je contacten of gebruiksstatistieken. Er is geen server die deze gegevens zou ontvangen."},
                {"type": "h2", "text": "2. Wat op je toestel blijft"},
                {"type": "p", "text": "Gevonden apparaten, je notities, gedempte apparaten en de monitoringgeschiedenis staan in de privéopslag van de app. Ze verdwijnen als je de lijst wist, de app-gegevens wist of de app verwijdert."},
                {"type": "h2", "text": "3. Netwerkverkeer"},
                {"type": "p", "text": "De app haalt periodiek detectiedefinities op van <code>ghosttooth.labidi.eu</code>. Zoals bij elk webverzoek ziet onze hostingprovider het publieke IP-adres dat het verzoek doet. We stellen geen profiel op en koppelen dat verzoek nergens aan. Er worden geen scanresultaten verstuurd — het verzoek is alleen-lezen."},
                {"type": "p", "text": "De app biedt optionele certificate pinning voor die verbinding. Die staat standaard uit omdat een legitieme certificaatvernieuwing de updates zou stoppen; hij is nuttig als je bang bent voor onderschepping."},
                {"type": "h2", "text": "4. Werking zonder internet"},
                {"type": "p", "text": "Alle detectiefuncties werken offline. De met de app meegeleverde definities worden gebruikt zolang er nog geen update is gedownload."},
                {"type": "h2", "text": "5. Machtigingen"},
                {"type": "table", "head": ["Machtiging", "Waarvoor"], "rows": [
                    ["Apparaten in de buurt (BLUETOOTH_SCAN)", "BLE-berichten ontvangen. Aangevraagd met <code>neverForLocation</code>: er wordt geen locatie uit afgeleid."],
                    ["BLUETOOTH_CONNECT", "Alleen op aanvraag, voor de optionele, experimentele GATT-uitlezing."],
                    ["Meldingen", "De monitoringmelding en waarschuwingen. Gewone meldingen, geen foreground service."],
                    ["Starten bij opstarten", "Monitoring hervatten na een herstart als je die had aangezet."],
                    ["Internet", "Uitsluitend om detectiedefinities te downloaden."],
                ]},
                {"type": "h2", "text": "6. Derden"},
                {"type": "p", "text": "Geen SDK's van derden, geen advertentienetwerken, geen analytics, geen crashrapportage. Er wordt niets met wie dan ook gedeeld."},
                {"type": "h2", "text": "7. Kinderen"},
                {"type": "p", "text": "We verzamelen van niemand gegevens, ongeacht leeftijd."},
                {"type": "h2", "text": "8. Je rechten (AVG)"},
                {"type": "p", "text": "Rechten op inzage, correctie en verwijdering gaan over gegevens die wij zouden bewaren. Wij bewaren er geen: er valt bij ons niets in te zien, te exporteren of te wissen. De gegevens op je toestel zijn van jou en je kunt ze op elk moment in de app verwijderen."},
                {"type": "h2", "text": "9. Wijzigingen"},
                {"type": "p", "text": "Wijzigingen in dit beleid worden hier gepubliceerd en vermeld in het <a href=\"{root}changelog/\">wijzigingslog</a>."},
                {"type": "h2", "text": "10. Contact"},
                {"type": "p", "text": "Vragen: <a href=\"mailto:" + SUPPORT_EMAIL + "\">" + SUPPORT_EMAIL + "</a>. Beveiligingsmeldingen: <a href=\"mailto:" + SECURITY_EMAIL + "\">" + SECURITY_EMAIL + "</a>."},
            ],
        },
    },
}

# ---------------------------------------------------------------------------
# Page registry consumed by build-site.py
# ---------------------------------------------------------------------------

PAGES = {
    "": LANDING,
    "safety": SAFETY,
    "terms": TERMS,
    "accessibility": ACCESSIBILITY,
    "changelog": CHANGELOG,
    "faq": FAQ,
    "privacy": PRIVACY,
}
