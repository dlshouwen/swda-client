<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="edit">编辑机构</el-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body">
				<el-row style="height:100%">
					<el-col :span="8" style="height:100%">
						<!-- form -->
						<sw-form ref="organForm" :model="organ">
							<!-- items -->
							<sw-form-item type="text" prop="organId" v-model="organ.organId" label="机构编号" valid="r|integer" disabled></sw-form-item>
							<sw-form-item type="text" prop="organCode" v-model="organ.organCode" label="机构编码" valid="r|english_number|l-le200" :valid-unique="{code:'organ.code.update', args:[organ.organId]}"></sw-form-item>
							<sw-form-item type="text" prop="organName" v-model="organ.organName" label="机构名称" valid="r|l-le400"></sw-form-item>
							<sw-form-item type="text" prop="contact" v-model="organ.contact" label="联系人" valid="r|l-le20"></sw-form-item>
							<sw-form-item type="text" prop="contactPhone" v-model="organ.contactPhone" label="联系电话" valid="r|l-le20"></sw-form-item>
							<sw-form-item type="cascader" prop="countyId" v-model="selectRegions" label="所属区域" valid="r" @change="regionChange" :item-props="{options:selectRegionOptions, clearable:true}"></sw-form-item>
							<sw-form-item type="text" prop="address" v-model="organ.address" label="详细地址" valid="r|l-le600"></sw-form-item>
							<sw-form-item type="text" prop="assistSearch" v-model="organ.assistSearch" label="辅助查询" valid="l-le400"></sw-form-item>
							<sw-form-item type="text" prop="sort" v-model="organ.sort" label="排序码" valid="r|integer"></sw-form-item>
							<sw-form-item type="textarea" prop="remark" v-model="organ.remark" label="备注" valid="l-le200"></sw-form-item>
							<!-- operation -->
							<sw-form-item>
								<sw-button type="success" :underline="false" icon="circle-check" @click="updateOrgan" permission="bms:system:organ:update">保存 (S)</sw-button>
								<sw-button type="warning" :underline="false" icon="refresh-left" @click="reset">重置 (R)</sw-button>
							</sw-form-item>
						</sw-form>
					</el-col>
					<el-col :span="16" style="height:100%;padding:8px;">
						<!-- map -->
						<div class="map-search">
							<el-input v-model="map.search.text" style="width:180px;"></el-input>
							<el-button type="primary" :underline="false" icon="search" @click="searchMap">检索 (s)</el-button>
						</div>
						<div v-if="map.pois&&map.pois.length>0" class="map-search-list">
							<div v-for="poi in map.pois" :class="'map-marker'+(map.poi&&poi.id==map.poi.id?' active':'')" @click="changeMapMarker(poi)">
								<h1><el-link icon="location" :underline="false">{{poi.name}}</el-link></h1>
								<h5>{{poi.id}}</h5>
								<h5>{{poi.category}}</h5>
								<p>{{poi.address}}</p>
							</div>
						</div>
						<div id="map_container" class="map-container"></div>
					</el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get region cascader list, get organ data, update organ
import { $getRegionCascaderList, $getOrganData, $updateOrgan } from '@/assets/config/api';

// import element plus: message, message box
import { ElMessage, ElMessageBox } from 'element-plus'

// import key
import key from 'keymaster';

// import tool
import * as tool from '@/assets/utils/tool';

// import store: data
import { useDataStore } from '@/store/data'
// get store: data
const dataStore = useDataStore();

// const state
const state = reactive({
	// select region options
	selectRegionOptions: [],
	// select regions
	selectRegions: [],
	// map
	map: {
		tencentMap: null,
		map: null,
		marker: null,
		circle: null,
		search: {
			text: '',
			server: null
		},
		poi: null,
		pois: null
	},
	// organ
	organ: { info:{} }
});

// to refs
const { selectRegionOptions, selectRegions, map, organ } = toRefs(state);

// props
const props = defineProps(['organId'])

// ref
const organForm = ref()

/**
 * reset
 */
const reset = () => {
	// reset data
	state.selectRegions = [];
	// get region cascader list
	getRegionCascaderList();
	// init map
	initMap();
	// get organ data
	getOrganData();
}

/**
 * init map
 */
const initMap = () => {
	// init map
	state.map.map = new qq.maps.Map(document.getElementById('map_container'));
	// listener click
	qq.maps.event.addListener(state.map.map, 'click', (event)=>{
		// set longitude / latitude
		state.organ.longitude = event.latLng.lng;
		state.organ.latitude = event.latLng.lat;
		// if not marker
		if(!state.map.marker){
			// new marker
			state.map.marker = new qq.maps.Marker({
				draggable: true,
				position:event.latLng,
				map:state.map.map
			});
			// set marker dragend
			qq.maps.event.addListener(state.map.marker, 'dragend', (event)=>{
				// set longitude / latitude
				state.organ.longitude = state.map.marker.position.lng;
				state.organ.latitude = state.map.marker.position.lat;
			});
		}else{
			// set marker position
			state.map.marker.position = event.latLng;
			// set marker to map
			state.map.marker.setMap(state.map.map);
		}
	});
	// set map search server
	state.map.search.server = new qq.maps.SearchService({
		// complete
		complete : (results)=>{
			// set map position
			state.map.pois = results.detail.pois;
			// change map marker
			changeMapMarker(state.map.pois[0]);
		}
	});
}

/**
 * search map
 */
const searchMap = () => {
	// if not select city
	if (!state.organ.cityId) {
		ElMessage.warning('请先选择城市，再执行地址检索操作。');
		return;
	}
	// get location
	let location = tool.searchCascader(state.selectRegionOptions, state.organ.cityId).label;
	// set location
	state.map.search.server.setLocation(location);
	// search
	state.map.search.server.search(state.map.search.text);
}

/**
 * change map marker
 * @param poi
 */
const changeMapMarker = (poi) => {
	// set poi
	state.map.poi = poi;
	// set longitude / latitude
	state.organ.longitude = poi.latLng.lng;
	state.organ.latitude = poi.latLng.lat;
	// set center
	state.map.map.setCenter(poi.latLng);
	// set zoom
	state.map.map.zoomTo(15);
	// if no marker
	if(!state.map.marker){
		// new marker
		state.map.marker = new qq.maps.Marker({ draggable:true, position:poi.latLng, map:state.map.map });
		// set markder dragend
		qq.maps.event.addListener(state.map.marker, 'dragend', (event)=>{
			// set longitude / latitude
			state.organ.longitude = state.map.marker.position.lng;
			state.organ.latitude = state.map.marker.position.lat;
		});
	}else{
		// set map position
		state.map.marker.position = poi.latLng;
		// set marker to map
		state.map.marker.setMap(state.map.map);
	}
}

/**
 * get region cascader list
 */
const getRegionCascaderList = () => {
	// get region cascader list
	$getRegionCascaderList().then(handler=>{
		// set select region options
		state.selectRegionOptions = handler.data.data.cascaderItems;
	});
}

/**
 * set select regions
 */
const setSelectRegions = () => {
	state.selectRegions = [state.organ.provinceId+'', state.organ.cityId+'', state.organ.countyId+''];
}

/**
 * region change
 * @param value
 */
const regionChange = (value) => {
	// set province id
	state.organ.provinceId = (value&&value.length>0)?value[0]:'';
	// set city id
	state.organ.cityId = (value&&value.length>1)?value[1]:'';
	// set county id
	state.organ.countyId = (value&&value.length>2)?value[2]:'';
}

/**
 * general assist search
 */
const generalAssistSearch = () => {
	// defined value
	let value = '';
	// append organ code
	value += state.organ.organCode?state.organ.organCode:'';
	// if organ name exist
	if(state.organ.organName){
		// append organ name
		value += state.organ.organName;
		// append organ name first spell / full spell
		value += tool.getFirstSpell(state.organ.organName);
		value += tool.getFullSpell(state.organ.organName);
	}
	// set assist search
	state.organ.assistSearch = value;
}

/**
 * get organ data
 */
const getOrganData = () => {
   	// get organ data
	$getOrganData({organId:props.organId}).then(handler=>{
		// set organ
		state.organ = handler.data.data.organ;
		// set select regions
		setSelectRegions();
		// if no marker
		if(!state.map.marker){
			// new marker
			state.map.marker = new qq.maps.Marker({
				draggable: true,
				position:new qq.maps.LatLng(state.organ.latitude, state.organ.longitude),
				map:state.map.map
			});
			// set markder dragend
			qq.maps.event.addListener(state.map.marker, 'dragend', (event)=>{
				// set longitude / latitude
				state.organ.longitude = state.map.marker.position.lng;
				state.organ.latitude = state.map.marker.position.lat;
			});
		}else{
			// set map position
			state.map.marker.position = new qq.maps.LatLng(state.organ.latitude, state.organ.longitude);
			// set marker to map
			state.map.marker.setMap(state.map.map);
		}
		// set map center
		state.map.map.setCenter(new qq.maps.LatLng(state.organ.latitude, state.organ.longitude));
	});
}

/**
 * update organ
 */
const updateOrgan = () => {
	// valid
	organForm.value.validate((valid)=>{
		if(valid){
			// confirm
			ElMessageBox.confirm('确定修改机构信息？', '提示').then(()=>{
				// update organ
				$updateOrgan(state.organ).then(handler=>{
					// success
					if(handler.data.result){
						// message
						ElMessage.success(handler.data.message);
						// reset
						reset();
					}
				});
			}).catch(()=>{});
		}
	});
}

// watch
watch(()=>props.organId, ()=>{ reset() }, {deep: true}) 
watch(()=>state.organ.organCode, ()=>{ generalAssistSearch() }, {deep: true}) 
watch(()=>state.organ.organName, ()=>{ generalAssistSearch() }, {deep: true}) 

// reset
nextTick(()=>{
	reset();
});

// hotkey
key('alt+s', ()=>{ updateOrgan();return false; });
key('alt+r', ()=>{ reset();return false; });
</script>

<style scoped>
/** map container */
.map-container{border:1px solid #d0d0d0;width:100%;height:324px;}

/** map search */
.map-search{position:absolute;bottom:20px;right:20px;padding:4px;background:white;z-index:9999;}
.map-search .el-button{height:22px;margin-left:4px;margin-right:0;}

/** map search list */
.map-search-list{position:absolute;bottom:54px;right:20px;background:white;z-index:9999;padding:8px;max-height:200px;overflow:auto;width:256px;}
.map-search-list>.map-marker{border-bottom:1px dotted #d0d0d0;padding:8px;}
.map-search-list>.map-marker:hover{background:#f0f0f0;}
.map-search-list>.map-marker.active{background:#dcf8ff;}
.map-search-list>.map-marker>h1{font-size:13px;color:#00a2ca;margin-bottom:4px;}
.map-search-list>.map-marker>h1>a{margin:0;}
.map-search-list>.map-marker>h1>a /deep/ i{margin-right:4px;}
.map-search-list>.map-marker>h5{font-size:12px;color:#999;margin-bottom:4px;font-weight:normal;}
.map-search-list>.map-marker>p{font-size:12px;color:#444;word-break:break-all;}
</style>