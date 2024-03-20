import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Socket, Channel } from 'phoenix';
import { useGomokuBoardStore } from './gomokuBoardStore';
import { COMMAND_TYPE, IEngineOutput } from '../components/definitions';

export const useEngineStore = defineStore('engineStore', {
  state: () => ({
    //engineOutput: ref(''), // For demonstration, might hold last message or be used differently
    isEngineOnline: ref<boolean>(false),
    evaluationScore: 10,
    socket: ref<Socket | null>(null), // Use ref to make socket reactive
    channel: ref<Channel | null>(null), // Use ref to make channel reactive
    // Other state properties as needed
  }),
  
  actions: {
    connectToSocket() {
      if (this.socket && this.channel) return; // Assume connection is already established
      this.socket = new Socket("ws://localhost:4000/socket");
      this.socket.connect();
      this.channel = this.socket.channel('AIgame:lobby', {});

      this.channel.join()
        .receive('ok', () => console.log('Successfully joined the AI game lobby'))
        .receive('error', resp => console.error('Unable to join the AI game lobby', resp));

      this.channel.on('engine_output', (response : IEngineOutput) => {
        this.processEngineOutput(response);
      });
    },
    sendMessage(commandType: COMMAND_TYPE, commandData: string) {
      // Ensure `channel` is available and ready
      if (!this.channel) {
        console.error('Channel is not set up.');
        return;
      }
      this.channel.push(commandType, { command: commandData });
    },

    // Example action to process engine output and interact with `gomokuBoardStore`
    processEngineOutput(response : IEngineOutput) {
      if(response.commandType == COMMAND_TYPE.start)
      {
        console.log(response.output);
        if(response.output.includes("OK"))
        {
          this.isEngineOnline = true;
        }
      }
     else if(response.commandType == COMMAND_TYPE.analyse)
     {
       // Directly use `gomokuBoardStore` to update UI based on engine output
       useGomokuBoardStore().updateBoardBasedOnEngineOutput(response.output); 
     }

     else if(response.commandType == COMMAND_TYPE.stop)
     {
       useGomokuBoardStore().playCurrentlyBestMove();
     }

    },
    updateEvaluationScore(newScore : number) {
    this.evaluationScore = newScore;
  },
     disconnect() {
      if (this.channel) {
        this.channel.leave(); // Leave the channel
      }
      if (this.socket) {
        this.socket.disconnect(); // Disconnect the socket
      }
      // Reset the refs
      this.socket = null;
      this.channel = null;
    },

  },
});