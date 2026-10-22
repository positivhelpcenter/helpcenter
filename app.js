
(() => {
  "use strict";

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // MENÜ
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  menuToggle?.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  $$("#mainNav a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav?.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // ALLTAGSHILFE
  const helpContent = {
    stress: {
      title: "Wir machen es kleiner.",
      text: "Wähle nur eine Sache, die jetzt wichtig ist. Der Rest muss nicht gleichzeitig gelöst werden."
    },
    sad: {
      title: "Du musst nichts vorspielen.",
      text: "Du darfst dich schlecht fühlen. Überleg, was dir gerade ein wenig Sicherheit oder Ruhe geben könnte."
    },
    motivation: {
      title: "Nur zwei Minuten.",
      text: "Mach den ersten Schritt absichtlich klein. Anfangen ist schon etwas anderes, als alles auf einmal schaffen zu müssen."
    },
    laugh: {
      title: "Ein kleiner Reset.",
      text: "Warum können Geister so schlecht lügen? Weil man durch sie hindurchsieht. 👻"
    }
  };

  const quickHelp = $("#quickHelp");

  $$(".help-card").forEach(card => {
    card.addEventListener("click", () => {
      const item = helpContent[card.dataset.help];
      if (!item || !quickHelp) return;
      $("#quickTitle").textContent = item.title;
      $("#quickText").textContent = item.text;
      quickHelp.hidden = false;
    });
  });

  $("#quickClose")?.addEventListener("click", () => {
    quickHelp.hidden = true;
  });

  $("#quickToChat")?.addEventListener("click", () => {
    $("#mentalchat")?.scrollIntoView({ behavior: "smooth" });
    const input = $("#chatInput");
    if (input) {
      input.value = "Ich weiß nicht genau, wo ich anfangen soll.";
      input.focus();
    }
  });

  // POSITIVE SPRÜCHE
  const quotes = [
    ["Du musst nicht alles heute lösen.", "Kleine Schritte"],
    ["Ein schwieriger Tag ist nicht dein ganzes Leben.", "Zuversicht"],
    ["Du darfst stolz auf Fortschritte sein, die niemand sieht.", "Selbstvertrauen"],
    ["Du musst nicht perfekt sein, um wichtig zu sein.", "Du zählst"],
    ["Auch Pausen gehören zum Weiterkommen.", "Pause"],
    ["Manchmal ist ein neuer Anfang einfach ein tiefer Atemzug.", "Für heute"],
    ["Du darfst lernen, während du unterwegs bist.", "Wachstum"],
    ["Du musst nicht schneller sein als dein eigenes Tempo.", "Gelassenheit"],
    ["Heute reicht vielleicht schon ein kleiner Schritt.", "Kleine Schritte"],
    ["Du darfst nett zu dir sein, auch wenn nicht alles klappt.", "Freundlichkeit"],
    ["Nicht jeder Gedanke braucht sofort eine Antwort.", "Ruhe"],
    ["Ein schlechter Moment macht nicht alles schlecht.", "Zuversicht"]
  ];

  let previousQuote = -1;

  $("#newQuote")?.addEventListener("click", () => {
    let next;
    do {
      next = Math.floor(Math.random() * quotes.length);
    } while (quotes.length > 1 && next === previousQuote);

    previousQuote = next;
    $("#quoteText").textContent = quotes[next][0];
    $("#quoteCategory").textContent = quotes[next][1];
  });

  // CHAT-ANTWORTEN
  // Zehn Themenbereiche mit jeweils 20 unterschiedlichen Antworten.
  const answers = {
    anxiety: [
      "Das klingt, als wäre dein Kopf gerade auf Alarm gestellt. Was macht dir am meisten Sorgen?",
      "Angst kann sich sehr überzeugend anfühlen, auch wenn noch gar nicht alles feststeht. Was ist gerade der beängstigende Teil?",
      "Du musst nicht jede Sorge sofort lösen. Was weißt du sicher, und was befürchtest du gerade?",
      "Wenn die Gedanken rasen, hilft manchmal erst einmal ein kleiner Schritt zurück. Was ist unmittelbar gerade los?",
      "Das hört sich belastend an. Möchtest du erzählen, was diese Angst ausgelöst hat?",
      "Manchmal versucht der Kopf, jedes mögliche Problem vorab zu lösen. Das ist anstrengend. Welche Sorge ist gerade am lautesten?",
      "Du musst nicht mutig wirken, um mit Angst umgehen zu können. Was würde dir gerade ein bisschen Sicherheit geben?",
      "Lass uns nicht alle Möglichkeiten gleichzeitig durchspielen. Was ist die konkrete Situation, vor der du stehst?",
      "Das kann einen ganz schön beschäftigen. Ist es etwas, das gerade passiert, oder eher etwas, das passieren könnte?",
      "Deine Sorge verdient es, ernst genommen zu werden. Wir können sie Schritt für Schritt anschauen.",
      "Ein Gedanke ist noch keine Vorhersage. Was befürchtest du, könnte passieren?",
      "Du musst nicht sofort eine perfekte Lösung finden. Was wäre gerade eine kleine Hilfe?",
      "Es klingt, als würdest du gerade viel im Kopf herumtragen. Magst du es in deinen eigenen Worten beschreiben?",
      "Wenn dein Kopf Katastrophen-Kino startet, muss der Film nicht automatisch wahr sein. Was ist tatsächlich passiert?",
      "Das ist gerade viel für dich. Gibt es jemanden, bei dem du dich in dieser Situation sicher fühlst?",
      "Du kannst unsicher sein und trotzdem den nächsten kleinen Schritt machen. Was steht als Nächstes an?",
      "Wir können versuchen, die Sorge etwas genauer zu sortieren. Was daran macht dir am meisten Angst?",
      "Manchmal wird eine Sorge größer, wenn man sie allein im Kopf herumträgt. Möchtest du sie einmal aussprechen?",
      "Du musst nicht erst angstfrei sein, bevor du dir Hilfe holen darfst.",
      "Ich höre, dass dich das beschäftigt. Was wäre gerade hilfreicher: darüber reden oder eine kleine Ablenkung?"
    ],

    sadness: [
      "Das klingt nach einem schweren Moment. Was ist heute passiert?",
      "Du musst hier keine gute Laune vorspielen. Ich höre dir zu.",
      "Manchmal lässt sich Traurigkeit nicht sofort wegmachen. Was drückt gerade am stärksten?",
      "Es tut mir leid, dass es dir gerade so geht. Möchtest du erzählen, was dahintersteckt?",
      "Du musst nicht sofort eine Lösung haben. Manchmal ist der erste Schritt, auszusprechen, was los ist.",
      "Klingt, als wäre heute einiges zusammengekommen. War es ein bestimmtes Ereignis oder hat sich vieles angesammelt?",
      "Du darfst einen schlechten Tag haben, ohne dich dafür zu rechtfertigen.",
      "Wenn du gerade keine Worte findest, ist das auch okay. Wir können langsam anfangen.",
      "Ich mache daraus keinen billigen Positiv-Spruch. Was würde dir gerade guttun?",
      "Manchmal hilft es, nicht allein mit dem Gefühl zu bleiben. Gibt es jemanden, dem du vertraust?",
      "Du musst nicht so tun, als wäre alles in Ordnung. Was würdest du gern loswerden?",
      "Es klingt, als wäre dir etwas wirklich nahegegangen. Magst du erzählen, was es war?",
      "Du musst nicht heute alles verarbeiten. Was würde diesen Moment ein wenig leichter machen?",
      "Wenn alles grau wirkt, kann selbst eine kleine Aufgabe groß sein. Was brauchst du gerade am ehesten?",
      "Ich bin hier für ein Gespräch, nicht für ein Urteil. Was ist passiert?",
      "Fühlt es sich eher nach Enttäuschung, Einsamkeit, Erschöpfung oder etwas anderem an?",
      "Du darfst traurig sein und trotzdem wertvoll sein. Was geht dir gerade durch den Kopf?",
      "Vielleicht muss es gerade nicht besser werden, sondern erst einmal etwas weniger schwer. Was könnte helfen?",
      "Es ist okay, wenn du nicht genau weißt, warum du dich so fühlst.",
      "Möchtest du darüber reden, eine kleine Idee finden oder lieber kurz auf andere Gedanken kommen?"
    ],

    stress: [
      "Dein Kopf klingt, als hätte er 42 Tabs offen. Wir schließen einen nach dem anderen. Was ist am dringendsten?",
      "Nicht alles muss gleichzeitig passieren. Welche eine Sache hat jetzt wirklich Vorrang?",
      "Lass uns die Aufgabe kleiner machen. Was wäre der erste Schritt, der höchstens fünf Minuten dauert?",
      "Das klingt nach ziemlich viel auf einmal. Was kann warten, auch wenn es sich gerade wichtig anfühlt?",
      "Du musst nicht den ganzen Berg heute besteigen. Welchen kleinen Abschnitt könntest du angehen?",
      "Wenn alles wichtig aussieht, ist Sortieren schon Arbeit. Was hat eine echte Frist?",
      "Mach kurz Pause, bevor du den nächsten Schritt planst. Was drückt am stärksten?",
      "Du bist kein Drucker, der einfach mehr Seiten ausspuckt, wenn man auf ihn hämmert. Was brauchst du gerade?",
      "Was wäre heute eine ausreichende Lösung statt einer perfekten?",
      "Es klingt, als hättest du gerade kaum Luft zwischen den Aufgaben. Was könnten wir vereinfachen?",
      "Lass uns unterscheiden: Was musst du wirklich tun, und was fühlt sich nur dringend an?",
      "Du darfst etwas verschieben oder um Hilfe bitten. Was liegt gerade auf deinen Schultern?",
      "Wenn du nur zehn Minuten hättest, womit würdest du anfangen?",
      "Ein Schritt nach dem anderen ist kein Spruch, sondern eine Reihenfolge. Was kommt zuerst?",
      "Du musst nicht alles im Kopf behalten. Schreib die drei wichtigsten Dinge auf und ignoriere den Rest kurz.",
      "Klingt nach Überlastung. Hast du gerade eher zu viele Aufgaben oder zu viele Gedanken?",
      "Wir machen aus dem Riesending eine Mini-Aufgabe. Was ist die kleinste machbare Version?",
      "Ein kurzer Reset ist erlaubt. Wasser, einmal strecken, dann nur die nächste Sache.",
      "Was wäre, wenn du heute nicht alles schaffen müsstest, sondern nur das Wichtigste?",
      "Ich helfe dir beim Sortieren. Was sind die zwei oder drei Dinge, die gerade gleichzeitig anstehen?"
    ],

    loneliness: [
      "Sich allein zu fühlen kann echt wehtun. Was fehlt dir gerade am meisten?",
      "Bist du gerade tatsächlich allein, oder fühlst du dich auch unter Menschen unverstanden?",
      "Du musst nicht besonders interessant oder lustig sein, damit Menschen gern Zeit mit dir verbringen.",
      "Das klingt einsam. Gibt es jemanden, dem du heute eine kleine Nachricht schicken könntest?",
      "Manchmal fühlt man sich ausgeschlossen, selbst wenn niemand es ausdrücklich sagt. Was ist passiert?",
      "Du musst dich nicht dafür schämen, Gesellschaft zu brauchen. Das ist menschlich.",
      "Was würdest du dir gerade von einem Freund oder einer Freundin wünschen?",
      "Fühlt es sich eher so an, als hätte niemand Zeit, oder als würde dich niemand richtig verstehen?",
      "Du musst nicht immer die Person sein, die zuerst schreibt. Aber vielleicht gibt es jemanden, bei dem ein kleiner Anfang möglich ist.",
      "Ich kann dir hier antworten, aber echte Nähe von vertrauten Menschen ist auch wichtig. Wer tut dir normalerweise gut?",
      "Das kann sich wie ein unsichtbarer Abstand zu allen anderen anfühlen. Wann ist dieses Gefühl besonders stark?",
      "Du musst dich nicht verstellen, nur um dazuzugehören. Wo kannst du am ehesten du selbst sein?",
      "Vielleicht braucht es nicht sofort eine große Freundesgruppe, sondern erst einen ehrlichen Kontakt.",
      "Hast du jemanden vermisst, oder ist dieses Gefühl schon länger da?",
      "Du bist nicht weniger wert, nur weil gerade niemand schreibt.",
      "Was wäre eine kleine Verbindung für heute: jemandem schreiben, gemeinsam etwas spielen oder kurz rausgehen?",
      "Manchmal sind wir von Menschen umgeben und fühlen uns trotzdem allein. Geht es dir gerade so?",
      "Du darfst sagen, dass du Gesellschaft brauchst. Das ist keine Schwäche.",
      "Was macht es dir gerade schwer, auf jemanden zuzugehen?",
      "Wenn du möchtest, können wir überlegen, wie du jemanden kontaktierst, ohne dass es sich riesig anfühlt."
    ],

    motivation: [
      "Mach es so klein, dass dein innerer Schweinehund kaum Zeit hat, Einspruch einzulegen. Was steht an?",
      "Du brauchst nicht erst Motivation, um zwei Minuten anzufangen. Welche Mini-Aufgabe wäre möglich?",
      "Nicht alles muss heute fertig werden. Was wäre ein guter Anfang?",
      "Wenn die Aufgabe riesig wirkt, ist sie vielleicht noch nicht klein genug. Was ist Schritt eins?",
      "Du darfst mit wenig Energie anfangen. Wie viel Kraft hast du gerade ungefähr?",
      "Wir setzen die Messlatte für den Anfang bewusst niedrig. Fünf Minuten reichen.",
      "Du musst nicht Lust darauf haben, um einen kleinen Schritt machen zu können.",
      "Was wäre die Version deiner Aufgabe, die du selbst an einem müden Tag schaffen könntest?",
      "Der Anfang darf unordentlich sein. Perfektion ist heute nicht eingeladen.",
      "Du kannst später weiterarbeiten. Jetzt geht es nur darum, die Tür einen Spalt zu öffnen.",
      "Manchmal kommt die Motivation erst nach dem Start. Was kannst du direkt vor dir erledigen?",
      "Du musst nicht deinen ganzen Plan umsetzen. Wähle eine Sache.",
      "Wenn dein Akku leer ist, ist ein realistischer Plan besser als ein heroischer.",
      "Lass uns die Aufgabe in drei Schritte zerlegen. Was willst du erledigen?",
      "Du hast nicht versagt, nur weil du noch nicht angefangen hast. Was hat dich bisher aufgehalten?",
      "Mach den ersten Schritt so einfach, dass du nicht lange darüber verhandeln musst.",
      "Was wäre heute genug, auch wenn es nicht perfekt ist?",
      "Ein kleiner Fortschritt ist besser als ein riesiger Plan, der dich lähmt.",
      "Stell dir einen Timer auf fünf Minuten und erlaube dir danach neu zu entscheiden.",
      "Was möchtest du schaffen? Ich helfe dir, daraus einen machbaren ersten Schritt zu machen."
    ],

    school: [
      "Schule kann sich wie ein Spiel ohne Anleitung anfühlen. Was genau musst du machen?",
      "Lass uns die Aufgabe gemeinsam kleiner machen. Welches Fach ist es?",
      "Du musst nicht alles auf einmal lernen. Was kommt zuerst dran?",
      "Ist es die Menge an Arbeit, die Angst vor der Note oder etwas anderes, das dich stresst?",
      "Wenn du nicht weißt, wo du anfangen sollst, lies erst einmal nur die Aufgabenstellung.",
      "Du darfst etwas nicht sofort verstehen. Welcher Teil ist unklar?",
      "Wir können einen kurzen Lernplan machen, ohne deinen ganzen Tag vollzupacken.",
      "Eine schlechte Note ist eine Rückmeldung, keine vollständige Bewertung deiner Fähigkeiten.",
      "Was ist die nächste Abgabe oder Prüfung? Dann sortieren wir die Prioritäten.",
      "Du musst nicht perfekt vorbereitet sein, um einen sinnvollen Anfang zu machen.",
      "Wenn du vor einem großen Lernberg sitzt, such dir erst ein einziges Thema aus.",
      "Was wäre heute realistisch: eine Aufgabe, ein Abschnitt oder zehn Minuten Wiederholen?",
      "Hast du eher Schwierigkeiten mit dem Stoff oder damit, überhaupt anzufangen?",
      "Du darfst Lehrkräfte oder Mitschüler um Erklärung bitten. Niemand versteht alles sofort.",
      "Lass uns den Stoff in kleine Fragen umwandeln. Was lernst du gerade?",
      "Dein Wert hängt nicht an einer Schulnote. Trotzdem können wir schauen, wie du dich vorbereitest.",
      "Was ist gerade am dringendsten und was kann bis morgen warten?",
      "Du brauchst keinen perfekten Lernplatz. Ein Blatt Papier und ein erster Schritt reichen.",
      "Wenn du müde bist, bringt ein realistischer Plan mehr als stundenlanges schlechtes Gewissen.",
      "Schick mir die Aufgabe in eigenen Worten, dann überlegen wir, wie du starten kannst."
    ],

    relationships: [
      "Das klingt, als würde dir die Situation mit dieser Person nahegehen. Was ist passiert?",
      "Bevor du antwortest, darfst du kurz überlegen, was du eigentlich sagen möchtest.",
      "Du kannst jemanden mögen und trotzdem Grenzen brauchen.",
      "Was hat dich mehr verletzt: das, was gesagt wurde, oder wie es sich angefühlt hat?",
      "Es ist schwer, wenn man nicht weiß, woran man bei jemandem ist. Was hat dich unsicher gemacht?",
      "Du musst nicht jeden Konflikt sofort lösen. Vielleicht hilft erst einmal etwas Abstand.",
      "Hast du der Person schon gesagt, wie es bei dir angekommen ist?",
      "Wir können eine Nachricht formulieren, die ehrlich ist, ohne extra Streit anzufangen.",
      "Eine andere Person kann deine Gefühle nicht immer erraten. Was würdest du gern verständlich machen?",
      "Du darfst Nein sagen, auch wenn du Angst hast, jemanden zu enttäuschen.",
      "Ist es eher ein Missverständnis, ein Streit oder fühlst du dich nicht ernst genommen?",
      "Du musst nicht die ganze Verantwortung für eine Beziehung allein tragen.",
      "Was würdest du einem Freund raten, wenn er genau das erlebt hätte?",
      "Manchmal hilft es, erst die Fakten von den Vermutungen zu trennen. Was weißt du sicher?",
      "Du darfst dir Zeit nehmen, bevor du entscheidest, wie du reagieren möchtest.",
      "Wenn du dich ständig verstellen musst, ist es okay, das ernst zu nehmen.",
      "Was wünschst du dir von dieser Person, ganz konkret?",
      "Du kannst Verständnis zeigen, ohne alles hinnehmen zu müssen.",
      "Möchtest du gerade eher Dampf ablassen oder eine Lösung für das Gespräch finden?",
      "Erzähl mir den Teil, der dich am meisten beschäftigt. Wir müssen nicht gleich urteilen."
    ],

    anger: [
      "Du klingst richtig wütend. Was hat das Fass zum Überlaufen gebracht?",
      "Du musst nicht so tun, als wäre es okay. Was genau hat dich geärgert?",
      "Bevor du etwas schreibst, das du später bereust, kann eine kurze Pause helfen.",
      "Wut zeigt oft, dass etwas wichtig war oder eine Grenze überschritten wurde. Was war es bei dir?",
      "Was wäre eine Reaktion, mit der du morgen noch zufrieden wärst?",
      "Du darfst sauer sein und trotzdem entscheiden, was du als Nächstes tust.",
      "War es eher unfair, respektlos oder einfach zu viel auf einmal?",
      "Lass uns zuerst sortieren, was passiert ist, bevor wir die Lösung suchen.",
      "Manchmal braucht Wut erst einen sicheren Ort, bevor man ein Gespräch führen kann.",
      "Was hättest du dir in dieser Situation gewünscht?",
      "Du musst nicht sofort vergeben oder so tun, als wäre nichts gewesen.",
      "Wenn du gerade auf 100 bist, ist ein wenig Abstand oft besser als eine Sofort-Antwort.",
      "Was ist der wichtigste Punkt, den die andere Person verstehen sollte?",
      "Du kannst deutlich sein, ohne verletzend werden zu müssen.",
      "War das ein einmaliger Vorfall oder passiert es immer wieder?",
      "Es klingt, als hättest du dich nicht ernst genommen gefühlt. Stimmt das ungefähr?",
      "Was kannst du kontrollieren, und was liegt gerade nicht bei dir?",
      "Wir müssen die Wut nicht wegreden. Wir können schauen, was sie dir sagen will.",
      "Wenn du willst, erzähl es erstmal ungefiltert – wir suchen danach die Worte für ein Gespräch.",
      "Was würde dir jetzt helfen: Abstand, Bewegung, reden oder eine konkrete Lösung?"
    ],

    humor: [
      "Warum nehmen Skelette nie an Streitgesprächen teil? Sie haben nicht den Mumm dazu. 💀",
      "Mein innerer Schweinehund hat heute Homeoffice beantragt. Antrag wurde aus Faulheit genehmigt.",
      "Warum war das Mathebuch traurig? Es hatte zu viele Probleme.",
      "Ich wollte heute produktiv sein. Dann haben wir uns gegenseitig nicht gefunden.",
      "Mein Gehirn hat 47 Tabs offen und einer davon spielt Musik. Ich finde ihn nicht.",
      "Warum sind Kalender so beliebt? Sie haben viele Dates.",
      "Ich habe meine To-do-Liste gefragt, ob sie mich mag. Sie meinte: 'Wir müssen noch einiges klären.'",
      "Warum können Fische so schlecht rechnen? Weil sie immer mit dem Schwarm zählen.",
      "Motivation ist wie WLAN: Manchmal ist sie da, aber das Signal ist schwach.",
      "Ich wollte früh schlafen. Dann habe ich mich an etwas erinnert, das ich 2017 gesagt habe.",
      "Warum gehen Pilze gern auf Partys? Weil sie Champignons sind.",
      "Mein Plan für heute: improvisieren und so tun, als wäre das Absicht.",
      "Warum sind Geister schlechte Lügner? Weil man durch sie hindurchsieht.",
      "Ich habe aufgeräumt. Jetzt finde ich nichts mehr. Erfolg ist kompliziert.",
      "Der Montag hat angerufen. Ich habe nicht abgenommen.",
      "Warum war der Computer kalt? Er hatte Windows offen.",
      "Ich mache gerade Multitasking: gleichzeitig müde sein und nichts schaffen.",
      "Meine Motivation ist nicht weg. Sie ist nur kurz etwas holen gegangen.",
      "Warum war der Stift beleidigt? Weil man ihn ständig links liegen ließ.",
      "Soll ich noch einen Witz erzählen oder brauchst du eher Ablenkung mit einer ganz anderen Frage?"
    ],

    selfworth: [
      "Du musst nicht erst etwas leisten, um Respekt und Freundlichkeit zu verdienen.",
      "Vergleiche zeigen oft nur einen kleinen Ausschnitt vom Leben anderer.",
      "Du darfst Fehler machen, ohne dich selbst zum Fehler zu erklären.",
      "Was würdest du einem Menschen sagen, den du gern hast, wenn er so über sich reden würde?",
      "Du musst nicht von allen gemocht werden, um wertvoll zu sein.",
      "Ein schwieriger Moment sagt nicht alles über dich aus.",
      "Du darfst noch lernen und dich verändern, ohne dich dafür abzuwerten.",
      "Dein Wert ist keine Schulnote und kein Wettbewerb.",
      "Du musst nicht immer stark sein, damit andere dich ernst nehmen.",
      "Es ist okay, wenn du gerade nicht stolz auf dich bist. Du verdienst trotzdem Freundlichkeit.",
      "Was ist passiert, dass du gerade so streng mit dir bist?",
      "Ein Fehler beschreibt etwas, das du getan hast – nicht dein ganzes Ich.",
      "Du siehst deine eigenen Zweifel oft deutlicher als andere Menschen.",
      "Du musst nicht perfekt sein, um eine gute Freundin oder ein guter Freund zu sein.",
      "Auch wenn du gerade unsicher bist, darfst du deinen Platz einnehmen.",
      "Du darfst Hilfe brauchen und trotzdem selbstständig sein.",
      "Was ist eine Sache, die du an dir schätzt, auch wenn sie klein wirkt?",
      "Vielleicht musst du dich nicht sofort toll finden. Ein bisschen weniger hart zu dir wäre schon ein Anfang.",
      "Du bist mehr als das, was heute schiefgelaufen ist.",
      "Was genau lässt dich gerade an dir zweifeln? Wir können es gemeinsam auseinandernehmen."
    ],

    general: [
      "Ich möchte dich nicht mit einem Standardspruch abspeisen. Was meinst du genau?",
      "Erzähl mir ein bisschen mehr. Was ist der wichtigste Teil davon?",
      "Geht es dir gerade eher ums Verstandenwerden oder möchtest du eine konkrete Idee?",
      "Ich bin mir noch nicht sicher, wie du das meinst. Kannst du es anders beschreiben?",
      "Was ist vorher passiert? Der Zusammenhang könnte helfen.",
      "Wenn du es in einem Satz zusammenfassen müsstest: Was beschäftigt dich am meisten?",
      "Möchtest du, dass ich zuhöre, mit dir sortiere oder dich auf andere Gedanken bringe?",
      "Das kann mehrere Dinge bedeuten. Was davon passt am ehesten zu dir?",
      "Ich möchte nicht einfach raten und an dir vorbeireden. Was meinst du damit?",
      "Was wäre für dich eine hilfreiche Antwort auf das, was du gerade geschrieben hast?",
      "Ist das gerade etwas Neues oder beschäftigt es dich schon länger?",
      "Was macht die Situation für dich besonders schwierig?",
      "Was wäre ein kleiner Fortschritt, der sich heute gut anfühlen würde?",
      "Du kannst es auch chaotisch erzählen. Wir sortieren es danach.",
      "Ich bin eine lokale Chat-Demo, aber ich kann dir helfen, deine Gedanken zu ordnen. Wo sollen wir anfangen?",
      "Was ist der Teil, den du anderen vielleicht nicht so leicht erzählen würdest?",
      "Wenn du magst, beschreib einfach die Situation, ohne gleich eine Lösung zu suchen.",
      "Ich höre dir zu. Was sollte ich zuerst verstehen?",
      "Was würdest du dir gerade am meisten wünschen?",
      "Wollen wir bei dem bleiben, was dich beschäftigt, oder wäre Ablenkung gerade besser?"
    ]
  };

  // ERKENNUNG VON THEMEN UND UMSCHREIBUNGEN
  const matchers = [
    {
      topic: "crisis",
      words: [
        "suizid", "umbringen", "mich töten", "nicht mehr leben",
        "selbstverletz", "mir etwas antun", "nicht mehr da sein",
        "will sterben", "sterben wollen", "mich umbringen"
      ]
    },
    {
      topic: "anxiety",
      words: [
        "angst", "ängstlich", "sorge", "sorgen", "panik", "fürchte",
        "befürchte", "nervös", "unsicher", "was wenn", "grübel",
        "gedankenkarussell", "worst case", "katastrophe", "prüfungsangst"
      ]
    },
    {
      topic: "sadness",
      words: [
        "traurig", "weinen", "depress", "depri", "niedergeschlagen",
        "hoffnungslos", "verzweifelt", "leer", "unglücklich", "erschöpft",
        "kraftlos", "keine freude", "nichts macht spaß", "schlecht fühlen",
        "mir geht es mies", "mir gehts mies", "am ende"
      ]
    },
    {
      topic: "loneliness",
      words: [
        "einsam", "allein", "niemand", "keiner mag", "keiner schreibt",
        "ausgeschlossen", "nicht dazugehören", "keine freunde",
        "keine freundin", "keinen freund", "verlassen", "vermis"
      ]
    },
    {
      topic: "stress",
      words: [
        "stress", "überfordert", "zu viel", "druck", "schaffe das nicht",
        "keine zeit", "alles gleichzeitig", "zu viele", "chaos",
        "überlastet", "fertig machen", "zu erledigen", "keine pause"
      ]
    },
    {
      topic: "relationships",
      words: [
        "freund", "freundin", "beziehung", "liebe", "crush", "ex",
        "streit", "verliebt", "ignoriert", "ghost", "nachricht",
        "antwortet nicht", "eifersüchtig", "trennung", "missverständnis",
        "nicht ernst genommen", "herz gebrochen"
      ]
    },
    {
      topic: "anger",
      words: [
        "wütend", "sauer", "aggressiv", "hasse", "nervt", "ungerecht",
        "respektlos", "gemein", "ausgerastet", "rasend", "unfair"
      ]
    },
    {
      topic: "school",
      words: [
        "schule", "lernen", "prüfung", "klausur", "arbeit schreiben",
        "hausaufgabe", "lehrer", "lehrerin", "note", "referat",
        "zeugnis", "unterricht", "mathe", "vokabel"
      ]
    },
    {
      topic: "motivation",
      words: [
        "motivation", "keine lust", "keinen antrieb", "anfangen",
        "aufschieben", "prokrastin", "faul", "unproduktiv",
        "zimmer aufräumen", "aufräumen", "aufgabe"
      ]
    },
    {
      topic: "humor",
      words: [
        "witz", "lachen", "lustig", "humor", "scherz",
        "gute laune", "ablenkung", "langweilig", "langweile"
      ]
    },
    {
      topic: "selfworth",
      words: [
        "wertlos", "nichts wert", "hässlich", "dumm", "versager",
        "hasse mich", "schlecht genug", "nicht gut genug",
        "selbstbewusst", "selbstvertrauen", "vergleich", "alle besser"
      ]
    }
  ];

  const followUps = [
    "Und was ist danach passiert?",
    "Was daran beschäftigt dich am meisten?",
    "Was hättest du dir stattdessen gewünscht?",
    "Wie hast du dich in dem Moment gefühlt?",
    "Was macht es gerade besonders schwierig?",
    "Was wäre jetzt eine kleine Hilfe?",
    "Möchtest du mir den Zusammenhang erzählen?",
    "Ist das schon länger so oder erst seit heute?",
    "Was davon kannst du gerade beeinflussen?",
    "Was würdest du dir von jemand anderem wünschen?"
  ];

  const initialSuggestions = [
    "Heute ist alles zu viel",
    "Ich fühle mich gerade komisch",
    "Kannst du mich ablenken?"
  ];

  const suggestionSets = {
    anxiety: ["Ich mache mir zu viele Gedanken", "Ich habe Angst vor etwas", "Hilf mir, das zu sortieren"],
    sadness: ["Ich bin heute traurig", "Ich weiß nicht, warum es mir so geht", "Ich möchte darüber reden"],
    stress: ["Ich habe zu viel im Kopf", "Hilf mir, anzufangen", "Was kann gerade warten?"],
    loneliness: ["Ich fühle mich ausgeschlossen", "Ich vermisse jemanden", "Wie soll ich mich melden?"],
    motivation: ["Ich schiebe alles auf", "Mach die Aufgabe kleiner", "Ich brauche einen kleinen Plan"],
    school: ["Ich habe Angst vor einer Prüfung", "Ich kann mich nicht konzentrieren", "Hilf mir beim Lernen"],
    relationships: ["Jemand antwortet mir nicht", "Ich weiß nicht, was ich schreiben soll", "Ich bin verletzt"],
    anger: ["Ich bin gerade richtig sauer", "Wie sage ich das ruhig?", "Ich brauche kurz Abstand"],
    humor: ["Erzähl einen anderen Witz", "Ich brauche Ablenkung", "Gib mir etwas Zufälliges"],
    selfworth: ["Ich vergleiche mich ständig", "Ich zweifle an mir", "Wie werde ich weniger streng zu mir?"],
    general: ["Hilf mir, meine Gedanken zu sortieren", "Ich will einfach reden", "Lenk mich kurz ab"]
  };

  const crisisResponse =
    "Es tut mir leid, dass es gerade so schwer ist. Bitte bleib damit nicht allein: Wende dich jetzt an eine vertraute erwachsene Person und sag offen, dass du Unterstützung brauchst. Wenn du unmittelbar in Gefahr bist, ruf in Deutschland 112. Du kannst auch die TelefonSeelsorge unter 0800 111 0 111 oder 0800 111 0 222 kontaktieren. Ich bin nur eine Chat-Demo und kann persönliche Hilfe nicht ersetzen.";

  const history = [];
  const lastReplies = {};
  let lastTopic = "general";
  let messageCount = 0;

  function normalize(text) {
    return text.toLocaleLowerCase("de-DE")
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[^\p{L}\p{N}\s']/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function containsPhrase(text, phrase) {
    const normalizedText = ` ${normalize(text)} `;
    const normalizedPhrase = ` ${normalize(phrase)} `;
    return normalizedText.includes(normalizedPhrase);
  }

  function detectTopic(text) {
    const normalized = normalize(text);

    // Kritische Aussagen zuerst prüfen.
    const crisis = matchers.find(m => m.topic === "crisis");
    if (crisis?.words.some(word => containsPhrase(normalized, word))) {
      return "crisis";
    }

    // Alle passenden Themen bewerten, statt nur das erste Wort zu beachten.
    const scores = {};

    for (const matcher of matchers) {
      if (matcher.topic === "crisis") continue;
      scores[matcher.topic] = 0;

      for (const word of matcher.words) {
        if (containsPhrase(normalized, word)) {
          scores[matcher.topic] += word.includes(" ") ? 2 : 1;
        }
      }
    }

    const best = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])[0];

    if (best && best[1] > 0) return best[0];

    // Indirekte Aussagen und sinngemäße Hinweise
    const indirect = [
      { words: ["ich kann nicht mehr", "alles bricht zusammen", "ich pack das nicht", "mir wächst alles über den kopf"], topic: "stress" },
      { words: ["keiner versteht mich", "ich passe nirgends rein", "ich bin unsichtbar"], topic: "loneliness" },
      { words: ["ich bin am grübeln", "ich male mir alles aus", "ich kann nicht abschalten"], topic: "anxiety" },
      { words: ["ich bin zu nichts zu gebrauchen", "alle sind besser als ich", "ich enttäusche alle"], topic: "selfworth" },
      { words: ["wir reden kaum noch", "sie meldet sich nicht", "er meldet sich nicht", "ich wurde stehen gelassen"], topic: "relationships" },
      { words: ["ich bin innerlich leer", "alles ist sinnlos", "ich fühle gar nichts"], topic: "sadness" }
    ];

    for (const group of indirect) {
      if (group.words.some(word => containsPhrase(normalized, word))) {
        return group.topic;
      }
    }

    return "general";
  }

  function chooseDifferent(list, key) {
    if (!list || !list.length) return "";
    const previous = lastReplies[key] || [];
    const available = list.filter(item => !previous.includes(item));
    const pool = available.length ? available : list;
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    lastReplies[key] = [...previous, chosen].slice(-8);
    return chosen;
  }

  function getReply(text) {
    const topic = detectTopic(text);

    if (topic === "crisis") {
      lastTopic = topic;
      return crisisResponse;
    }

    const pool = answers[topic] || answers.general;
    let reply = chooseDifferent(pool, topic);

    // Bei Folge-Nachrichten die Unterhaltung etwas natürlicher fortsetzen.
    if (messageCount > 1 && topic === lastTopic && Math.random() < 0.22) {
      reply += " " + chooseDifferent(followUps, "followUps");
    }

    // Bei sehr kurzen oder unklaren Nachrichten gezielt nachfragen.
    const wordCount = normalize(text).split(" ").filter(Boolean).length;
    if (topic === "general" && wordCount <= 3 && Math.random() < 0.65) {
      reply = chooseDifferent([
        "Magst du mir ein bisschen mehr dazu sagen?",
        "Was meinst du genau? Ein Beispiel würde helfen.",
        "Geht es eher um etwas, das passiert ist, oder um ein Gefühl?",
        "Was sollte ich zuerst darüber wissen?",
        "Ich will nicht falsch raten. Kannst du es kurz erklären?"
      ], "clarify");
    }

    lastTopic = topic;
    return reply;
  }

  // VORSCHLÄGE: Immer drei sichtbar, passend zum letzten Thema.
  let lastSuggestions = [];

  function updateSuggestions(topic) {
    const list = suggestionSets[topic] || suggestionSets.general;
    let candidates = list.filter(item => !lastSuggestions.includes(item));

    if (candidates.length < 3) {
      candidates = [...list];
    }

    const selected = [];
    while (selected.length < 3 && candidates.length) {
      const index = Math.floor(Math.random() * candidates.length);
      selected.push(candidates.splice(index, 1)[0]);
    }

    lastSuggestions = selected;

    const container = $("#suggestions");
    if (!container) return;

    container.replaceChildren();

    selected.forEach(prompt => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = prompt;
      button.addEventListener("click", () => sendMessage(prompt));
      container.append(button);
    });
  }

  // CHAT-OBERFLÄCHE
  const chatForm = $("#chatForm");
  const chatInput = $("#chatInput");
  const chatMessages = $("#chatMessages");
  let sending = false;

  function addMessage(text, who) {
    if (!chatMessages) return;

    const wrapper = document.createElement("div");
    wrapper.className = `message message-${who}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = text;

    const time = document.createElement("span");
    time.className = "message-time";
    time.textContent = who === "bot" ? "Mentalchat" : "Du";

    wrapper.append(bubble, time);
    chatMessages.append(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    history.push({ who, text });
    if (history.length > 40) history.shift();
  }

  function sendMessage(rawText) {
    const text = String(rawText || "").trim();
    if (!text || sending) return;

    sending = true;
    addMessage(text, "user");
    if (chatInput) chatInput.value = "";

    const topic = detectTopic(text);
    const reply = getReply(text);
    messageCount++;

    window.setTimeout(() => {
      addMessage(reply, "bot");
      updateSuggestions(topic === "crisis" ? "general" : topic);
      sending = false;
      chatInput?.focus();
    }, 250);
  }

  chatForm?.addEventListener("submit", event => {
    event.preventDefault();
    sendMessage(chatInput?.value);
  });

  // Startvorschläge werden immer angezeigt.
  const suggestions = $("#suggestions");
  if (suggestions) {
    suggestions.replaceChildren();
    initialSuggestions.forEach(prompt => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = prompt;
      button.addEventListener("click", () => sendMessage(prompt));
      suggestions.append(button);
    });
    lastSuggestions = [...initialSuggestions];
  }

  // FOOTER
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
