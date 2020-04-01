import Vue from "vue";
import Router from "vue-router";
import KU from "@/components/KU";
import Exercise from "@/components/Exercise";
import Home from "@/components/Home";
import Login from "@/components/Login";
import Admin from "@/components/Admin";
import Estimate from "@/components/Estimate";
import RootLogin from "@/components/RootLogin";
import Similarity from "@/components/Similarity";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/ku",
      name: "Knowledge Unit",
      component: KU
    },
    {
      path: "/exercise",
      name: "Exercise",
      component: Exercise
    },
    {
      path: "/estimate",
      name: "Estimate",
      component: Estimate
    },
    {
      path: "/similarity",
      name: "Similarity",
      component: Similarity
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/root",
      name: "Root",
      component: RootLogin
    },
    {
      path: "/admin",
      name: "Admin",
      component: Admin,
      children: [
        {
          path: "/concept",
          name: "concept",
          component: () => import("@/components/admin/concept.vue")
        },
        {
          path: "/knowledgePoint",
          name: "knowledgePoint",
          component: () => import("@/components/admin/knowledgePoint.vue")
        },
        {
          path: "/relation",
          name: "relation",
          component: () => import("@/components/admin/relation.vue")
        },
        {
          path: "/importNode",
          name: "importNode",
          component: () => import("@/components/admin/importNode.vue")
        },
        {
          path: "/importEdge",
          name: "importEdge",
          component: () => import("@/components/admin/importEdge.vue")
        },
        {
          path: "/bulkImport",
          name: "bulkImport",
          component: () => import("@/components/admin/bulkImport.vue")
        }
      ]
    },
    {
      name: "404",
      path: "/404",
      component: () => import("@/components/404.vue")
    },
    {
      path: "*",
      redirect: "/404"
    }
  ]
});

// 路由控制
router.beforeEach((to, from, next) => {
  const route = [
    "Admin",
    "concept",
    "knowledgePoint",
    "relation",
    "importNode",
    "importEdge",
    "bulkImport"
  ];
  if (route.indexOf(to.name) >= 0) {
    if (!sessionStorage.user) {
      next({ path: "/login" });
    }
  }
  next();
});

export default router;
