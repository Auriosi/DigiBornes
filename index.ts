interface Room {
    id: string;
    name: string;
    creationTime: number;
    clients: Client[];
    players: Player[];
    password: string | null;
    maxPlayers: number;
    host: Client;
    currentlyPlaying: boolean;
    currentTurn: number;
}

interface Client {
    id: string;
    name: string;
    currentRoom: Room;
}

interface Player {
    client: Client;
    score: number;
    hand: Card[];
    inPlay: Card[];
    playOrder: number;
}

interface Card {
    type: CardType;
    counteredBy: boolean | CardType;
}

enum CardType {
    Drive,
    Stop,
    SpeedLimit,
    EndOfSpeedLimit,
    EmergencyVehicle,
    Accident,
    Repairs,
    DrivingAce,
    OutOfGas,
    Gasoline,
    BackupTank,
    FlatTire,
    SpareTire,
    PunctureProofTires,
    TwentyFive,
    Fifty,
    SeventyFive,
    Hundred,
    TwoHundred
}

const server = Bun.serve({
    port: 8080,
    fetch(req) {
        const requestUrl = new URL(req.url);
        if (requestUrl.pathname === "/") {
            return new Response(Bun.file("client/index.html"), { headers: { "Content-Type": "text/html" } });
        } else if (requestUrl.pathname === "/websocket") {
            if (server.upgrade(req)) {
                return;
            }
            return new Response("Failed to upgrade to websocket connection", { status: 500 });
        } else if (requestUrl.pathname.startsWith("/client/")) {
            return new Response(Bun.file(requestUrl.pathname.replaceAll("..", "")), { headers: { "Content-Type": "" } });
        } else {
            return new Response(Bun.file("client/404.html"), { headers: { "Content-Type": "text/html" }, status: 404 });
        }
    },
    websocket: {
        open(ws) {
            // Send initialization information
        },
        close(ws) {
            // Cleanup client
        },
        message(ws, message) {
            // Handle message
        }
    },
    error(error) {
        console.log(error);
        return new Response("Something went wrong!", { status: 500 });
    }
});