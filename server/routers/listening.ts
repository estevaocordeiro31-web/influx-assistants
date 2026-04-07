export interface ListeningGap {
  id: number;
  answer: string;
  hint: string;
}

export interface ListeningData {
  title: string;
  description: string;
  audioScript: string;
  gaps: ListeningGap[];
  scriptWithBlanks: string; // script with [_1_], [_2_] etc.
}

export const STPATRICKS_LISTENING: ListeningData = {
  title: "St. Patrick's Night — The Friends Catch Up",
  description: "Lucas, Emily e Aiko se encontram online para combinar os planos do St. Patrick's. Escute e complete os chunks que faltam.",
  audioScript: `Lucas: G'day everyone! Wait, that's Aiko's thing. I mean — happy St. Paddy's!
Emily: Happy St. Paddy's! Lucas, are you wearing green?
Lucas: Obviously! We're doing a pub crawl tonight — starting at McSorley's!
Aiko: No worries, mate! In Sydney it's 35 degrees and everyone's in green at Bondi Beach.
Emily: That's brilliant! Here in London it's freezing but Trafalgar Square is packed.
Lucas: Emily, tell them about last year's party.
Emily: Oh, the craic was mighty! Best St. Patrick's ever.
Aiko: Heaps of fun here too — no worries is our word of the night!
Lucas: Cheers! To the best St. Patrick's, wherever you are!
All: Cheers!`,
  scriptWithBlanks: `Lucas: G'day everyone! Wait, that's Aiko's thing. I mean — happy [_1_]!
Emily: Happy St. Paddy's! Lucas, are you wearing green?
Lucas: Obviously! We're doing a [_2_] tonight — starting at McSorley's!
Aiko: [_3_], mate! In Sydney it's 35 degrees and everyone's in green at Bondi Beach.
Emily: That's [_4_]! Here in London it's freezing but Trafalgar Square is packed.
Lucas: Emily, tell them about last year's party.
Emily: Oh, the [_5_] was mighty! Best St. Patrick's ever.
Aiko: Heaps of fun here too — [_6_] is our word of the night!
Lucas: [_7_]! To the best St. Patrick's, wherever you are!
All: Cheers!`,
  gaps: [
    { id: 1, answer: "St. Paddy's", hint: "Forma autêntica do nome do feriado" },
    { id: 2, answer: "pub crawl", hint: "Roteiro de bares" },
    { id: 3, answer: "No worries", hint: "Expressão australiana para 'tudo bem'" },
    { id: 4, answer: "brilliant", hint: "Elogio britânico para 'incrível'" },
    { id: 5, answer: "craic", hint: "Palavra irlandesa para diversão" },
    { id: 6, answer: "No worries", hint: "Expressão mais australiana do mundo" },
    { id: 7, answer: "Cheers", hint: "Brinde universal em inglês" }
  ]
};
