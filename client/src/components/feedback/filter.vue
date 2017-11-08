<template>
   <section id="filterbar" class="section"> 
    <div id="filterbanner" class="columns">
        <div class="column small-column full-banner has-text-left"><span v-show="pending">{{pending}} Análises pendentes</span></div>
        <div class="column small-column is-desktop inverted-banner"></div>
    </div>

    <div id="filterbody" class="columns is-multiline">
      <div class="column is-12">
        <inputbox placeholder="Separe as palavras desejadas por vírgula." :value="options.keywords" :on-change="onChange"  property="keywords" />
      </div>
      <div class="column">
        <selectbox :value="options.atos" :on-change="onChange" :list="atos" disabled-option="Ato" property="atos" />
      </div>
      <div class="column">
        <selectbox :value="options.region" :on-change="onChange" :list="region" disabled-option="Região" property="region"  />
      </div>
      <div class="column">
        <selectbox v-show="isStateRegion || isCityRegion" :value="options.state" :on-change="onChange" :list="stateList" disabled-option="Estado" property="state"  />
      </div>
      <div class="column">
        <selectbox v-show="isCityRegion" :value="options.city" :on-change="onChange" :list="cityList" disabled-option="Municipio" property="city"  />
      </div>
      
      <div class="column is-12">
        <div class="columns">
          <div class="column is-3">
            <inputdate :value="options.startDate" :on-change="onChange" :max="options.endDate" placeholder="Data Início" property="startDate"  />
          </div>
          <div class="column is-3">
            <inputdate :value="options.endDate" :on-change="onChange" :disabled="!options.startDate" :min="options.startDate" placeholder="Data Fim" property="endDate" />
          </div>
          <div class="column is-2 is-offset-4">
            <button class="filter-button button is-fullwidth is-small" :class="{ 'is-loading': isSearching }" v-on:click="filter()">Filtrar</button>
          </div>
        </div>
      </div>
    </div>

   </section> 
</template>

<script>
import inputbox from '../shared/input';
import inputdate from '../shared/input.date';
import selectbox from '../shared/select';
import states from '../../../data/sp_e_rj';
import filterOptions from '../../data/filter_options';

export default {
  components: {
    inputbox,
    inputdate,
    selectbox
  },
  props: ['search', 'isSearching', 'pending'],
  beforeMount () {
    this.options = filterOptions;
  },
  data (){
    return {
      region: ['Municipal', 'Estadual', 'Federal'],
      atos: ['Leis', 'Leis Complementares', 'Decretos'],
      options: {
        keywords: '',
        atos: '',
        region: '',
        state: '',
        city: '',
        startDate: null,
        endDate: null
      },
      isModalActive: false
    }
  },
  methods: {
    filter () {
      this.search(filterOptions);
    },
    onChange (property, value) {
      filterOptions[property] = value;
      this.options[property] = value;
    }
  },
  computed: {
    isCityRegion () {
      return this.options.region === 'Municipal';
    },
    isStateRegion () {
      return this.options.region === 'Estadual';
    },
    stateList () {
      return states.map(state => state.nome);
    },
    cityList () {
      if (this.options.state && this.isCityRegion) {
        let selectedState = this.options.state;
        // console.log('Selected: ', selectedState);
        let cities = states.filter(state => state.nome === selectedState)[0].cidades;
        return cities;
      }
      return [];
    }
  }

}
</script>

<style>
#filterbody {
  background-color: #fff;
  border-left: 1px solid #bbb; 
  border-right: 1px solid #bbb; 
  border-bottom: 1px solid #bbb; 
}

.full-banner {
  min-height: 27px;
  background-color: #9659D0;
  color: #eee;
}

.inverted-banner {
  /* background-color: #9659D0; */
  /* color: #eee; */
  border: 1px solid #9659D0;
}

.small-column {
  padding: 0.1rem 0.3rem;
}

.filter-button {
  color: #fff;
  background-color: #9659D0 !important;
  border: 0;
  border-radius: 0 !important;
}

.filter-button:hover {
  color: #eee;
}

.filter-button:focus {
  border: 0;
  box-shadow: none;
  -webkit-box-shadow: none;
  color: #fff;
}
</style>
