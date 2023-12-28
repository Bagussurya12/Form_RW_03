<template>
  <div>
    <v-row
      v-for="(question, index) in questions"
      :key="index"
      @click="active(index)"
    >
      <v-col md="8" offset-md="2" sm="10" offset-sm="1">
        <v-card :id="`card-${index}`" class="card-questions card-border-left">
          <v-card-text background="white" class="pb-0">
            <v-row>
              <v-col cols="8" sm="8">
                <QuestionInput :question="question" :formId="formId" />
              </v-col>
              <v-col cols="4" sm="4">
                <QuestionSelectType :question="question" :formId="formId" />
              </v-col>
            </v-row>
            <v-row class="mt-0">
              <v-col cols="12">
                <QuestionTypeText class="mb-4" v-if="question.type == 'Text'" />
                <QuestionTypeEmail
                  class="mb-4"
                  v-else-if="question.type == 'Email'"
                />
                <QuestionTypeRadio
                  class="mb-4"
                  v-else-if="question.type == 'Radio'"
                  :question="question"
                  :formId="formId"
                />
                <QuestionTypeCheckbox
                  class="mb-4"
                  v-else-if="question.type == 'Checkbox'"
                  :question="question"
                  :formId="formId"
                />
                <QuestionTypeDropdown
                  class="mb-4"
                  v-else-if="question.type == 'Dropdown'"
                  :question="question"
                  :formId="formId"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider class="mx-4 mb-0"></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <QuestionBtnRemove :questionId="question.id" :formId="formId" />
            <v-divider vertical class="mx-3"></v-divider>
            <label for="required" class="mr-3">Required?</label>
            <QuestionSwitchRequired
              :question="question"
              :formId="formId"
              class="mt-0"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["formId"],
  computed: {
    ...mapState("questions", ["questions"]),
  },
  methods: {
    active(index) {
      let clickedElement = document.getElementById(`card-${index}`);

      if (clickedElement.classList.contains("active")) {
        //to make sure that the card is not already active
        return true;
      }

      let active = document.getElementsByClassName("cards-questions active")[0];

      if (active) {
        //remove before active
        active.classList.remove("active");
      }

      //new active
      clickedElement.classList.add("active");
    },
  },
};
</script>
