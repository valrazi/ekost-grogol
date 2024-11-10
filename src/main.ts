import app from "@/core/app";
import router from "@/core/router";
import pinia from "@/core/pinia";
import i18n from "@/core/i18n";

import "@/assets/css/main.css";
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faBroom, faBus, faCartShopping, faGraduationCap, faHospital, faIndustry, faMugSaucer, faPersonMilitaryPointing, faVideo, faWifi, faCircleChevronLeft, faCircleChevronRight, faUser, faCommentDots, faTableColumns, faHouse, faDoorClosed, faComment, faUserGroup, faBookmark, faCircleXmark, faEye, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faWifi, faGraduationCap, faIndustry, faMugSaucer, faCartShopping, faBus, faHospital, faVideo, faPersonMilitaryPointing, faBroom, faCircleChevronLeft, faCircleChevronRight, faUser, faCommentDots,
    faTableColumns, faHouse, faDoorClosed, faComment, faUserGroup, faBookmark, faCircleXmark, faEye, faRightFromBracket
)

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

app.use(router);
app.use(pinia);
app.use(i18n);
app.use(ElementPlus)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount("#app");
