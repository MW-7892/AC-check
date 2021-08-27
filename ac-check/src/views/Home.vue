<template>
    <v-app>
        <v-card-text 
            class = "text-left text-lg-center font-weight-bold headerfont my-6" 
            style = "font-size: 50px; line-height: 1.45; margin-left: auto; margin-right: auto; width: 85%"
            max-width = "500"
        >Find out more about your AC usage.</v-card-text>
        <v-card max-width = "500" style = "width: 80%; margin-left: auto; margin-right: auto;" flat color = "transparent">
            <v-form>
                <v-text-field
                    label = "Temperature"
                    v-model = "Temp"
                    suffix = "°C"
                    :rules = "[v => /^\d+$/.test(v) || 'Not a number',
                                v => !!v || 'Require number',
                                v => (v <= 30 && v >= 15) || 'The input must between 15 - 30',]"
                ></v-text-field>
                <v-text-field
                    label = "Hour"
                    v-model = "Hour"
                    :rules = "[v => /^\d+$/.test(v) || 'Not a number', v => !!v || 'Require number']"
                ></v-text-field>
                <v-btn
                
                >SUBMIT</v-btn>
                <v-btn
                    @click = "showAdvanced"
                >ADVANCED</v-btn>
                <v-expand-transition>
                    <v-card v-show = "advanced" flat color = "transparent">
                        <v-text-field
                            label = "BTU"
                            v-model = "btu"
                            :rules = "[v => /^\d+$/.test(v) || 'Not a number', v => !!v || 'Require number']"
                        ></v-text-field>
                    </v-card>
                </v-expand-transition>
            </v-form>
            <v-sheet
            class="v-sheet--offset mx-auto"
            color="cyan"
            elevation="12"
            max-width="calc(100% - 32px)"
            >
            <v-sparkline
                :labels="labels"
                :value="value"
                :fill="fill"
                gradient-direction = "top"
                color="white"
                line-width="2"
                padding="16"
            ></v-sparkline>
            </v-sheet>
        </v-card>
    </v-app>
</template>
<script>

import {RTDB} from "@/firebase";
export default {
  name: 'App',

  components: {

  },
  data: () => ({
    Temp: 25,
    Hour: 0,
    advanced: false,
    btu: 12000,
    total: 0,
    lessthanyou: 0,
    ip: [],
    term: [],
    labels: ['12am','3am','6am','9am','12pm','3pm','6pm','9pm',],
    value: [200,675,410,390,310,460,250,240,],
  }),
  methods:{
      getResult(){
          var percent_diff = (100 - ((this.Temp - 26) * 6)) / 100.0
          var unit = 0.69 / percent_diff.toFixed(2)
          var unit_day = unit * this.Hour.toFixed(2) * this.btu.toFixed(2) / 96000
          var cost_day = unit_day * 3.9 
          return [unit_day, cost_day]
      }, 
      async checkPercent(){
          await RTDB.ref(`Temperature`).once('value', snapshot => {
            const data = snapshot.val();
            Object.keys(data).forEach(key => {
                if(key == "total"){
                    this.total = data[key]
                }if(parseInt(key, 10) < this.Temp){
                    this.lessthanyou += data[key]
                }
          })
        }) 
      },
      showAdvanced(){
          this.advanced = !this.advanced
      },
  },
  async created(){
      await fetch('https://api.ipify.org?format=json')
        .then(x => x.json())
        .then(({ ip }) => {
         this.term = ip;
        });
        await fetch('https://api.geoapify.com/v1/ipinfo?apiKey=YOUR_API_KEY', { 
            method: 'GET'
        })
        .then(function(response) { return response.json(); })
        .then(function(json) {
            console.log(json)
        });
    //console.log(this.term)
  }
};
</script>