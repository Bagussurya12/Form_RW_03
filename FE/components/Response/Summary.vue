<template>
  <div>
    <v-row :key="index" v-for="(summary, index) in response.summaries">
      <v-col md="8" offset-md="2" sm="10" offset-sm="1">
        <v-card class="cards-questions card-border-left">
          <v-card-text background="white" class="pb-0">
            <v-row>
              <v-col cols="12">
                <h3>{{ summary.question }}</h3>
              </v-col>
            </v-row>

            <v-row class="mt-0">
              <v-col cols="12" v-if="summary.answers.length > 0">
                <Gchart
                  v-if="summary.type == 'Text' || summary.type == 'Email'"
                  type="ColumnChart"
                  :data="group(summary.answers)"
                />
                <Gchart
                  v-else-if="summary.type == 'Radio'"
                  type="PieChart"
                  :data="group(summary.answers)"
                />
                <GChart
                  v-else-if="summary.type == 'Dropdown'"
                  type="BarChart"
                  :data="group(summary.answers)"
                />
                <GChart
                  v-else-if="summary.type == 'Checkbox'"
                  type="BarChart"
                  :data="groupCheckbox(summary.answers)"
                />
              </v-col>
              <v-col cols="12" v-else>
                <p class="text-center">Belum Ada Jawaban / Response</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Gchart } from "vue-google-charts/legacy";

export default {
  middleware: ["authenticated"],
  components: {
    Gchart,
  },
  props: ["formId"],
  data() {
    return {
      chartData: [["", ""]],
      chartOptions: {},
    };
  },
  computed: {
    ...mapState("response", ["response"]),
  },
  methods: {
    group(answers) {
      let gchart = [];
      let groupingByValue = answers.reduce((acc, answer) => {
        if (answer == null || answer == "") {
          return acc;
        }
        if (acc[answer]) {
          acc[answer]++;
        } else {
          acc[answer] = 1;
        }
        return acc;
      }, {});

      var result = Object.keys(groupingByValue).map((key) => [
        key,
        groupingByValue[key],
      ]);
      gchart.push(["", ""]);
      gchart.push(...result);

      return gchart;
    },
    groupCheckbox(answer) {
      let gchart = [];

      let groupingByValue = answer.flat().reduce((acc, answer) => {
        if (answer == null || answer == "") {
          return acc;
        }

        if (acc[answer]) {
          acc[answer]++;
        } else {
          acc[answer] = 1;
        }
        return acc;
      }, {});

      var result = Object.keys(groupingByValue).map((key) => [
        key,
        groupingByValue[key],
      ]);

      gchart.push(["", ""]);
      gchart.push(...result);

      return gchart;
    },
  },
};
</script>
