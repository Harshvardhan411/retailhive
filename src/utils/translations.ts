export type Language = 'en' | 'es' | 'fr' | 'hi' | 'zh';

export interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    es: 'Inicio',
    fr: 'Accueil',
    hi: 'होम',
    zh: '首页'
  },
  'nav.profile': {
    en: 'Profile',
    es: 'Perfil',
    fr: 'Profil',
    hi: 'प्रोफ़ाइल',
    zh: '个人资料'
  },
  'nav.logout': {
    en: 'Logout',
    es: 'Cerrar sesión',
    fr: 'Déconnexion',
    hi: 'लॉगआउट',
    zh: '退出登录'
  },

  // User Dashboard
  'user.welcome': {
    en: 'Welcome to RetailHive',
    es: 'Bienvenido a RetailHive',
    fr: 'Bienvenue sur RetailHive',
    hi: 'RetailHive में आपका स्वागत है',
    zh: '欢迎使用 RetailHive'
  },
  'user.categories': {
    en: 'Category Wise Details',
    es: 'Detalles por Categoría',
    fr: 'Détails par Catégorie',
    hi: 'श्रेणी के अनुसार विवरण',
    zh: '按类别查看详情'
  },
  'user.shops': {
    en: 'List of Shop Details',
    es: 'Lista de Detalles de Tiendas',
    fr: 'Liste des Détails des Magasins',
    hi: 'दुकानों की सूची',
    zh: '商店详情列表'
  },
  'user.offers': {
    en: 'List Offer Products',
    es: 'Lista de Productos con Ofertas',
    fr: 'Liste des Produits en Promotion',
    hi: 'ऑफर प्रोडक्ट्स की सूची',
    zh: '优惠产品列表'
  },
  'user.compare': {
    en: 'Compare Products',
    es: 'Comparar Productos',
    fr: 'Comparer les Produits',
    hi: 'प्रोडक्ट्स की तुलना करें',
    zh: '比较产品'
  },
  'user.recommendations': {
    en: 'Personalized Recommendations',
    es: 'Recomendaciones Personalizadas',
    fr: 'Recommandations Personnalisées',
    hi: 'व्यक्तिगत सिफारिशें',
    zh: '个性化推荐'
  },
  'user.qrCodes': {
    en: 'QR Code Generator',
    es: 'Generador de Códigos QR',
    fr: 'Générateur de Codes QR',
    hi: 'QR कोड जनरेटर',
    zh: '二维码生成器'
  },
  'user.filter': {
    en: 'Filter',
    es: 'Filtrar',
    fr: 'Filtrer',
    hi: 'फ़िल्टर',
    zh: '筛选'
  },
  'user.shopOffers': {
    en: 'Shop Wise Offers',
    es: 'Ofertas por Tienda',
    fr: 'Offres par Magasin',
    hi: 'दुकान के अनुसार ऑफर',
    zh: '按商店查看优惠'
  },
  'user.floors': {
    en: 'Floor Wise Details',
    es: 'Detalles por Piso',
    fr: 'Détails par Étage',
    hi: 'फ्लोर के अनुसार विवरण',
    zh: '按楼层查看详情'
  },
  'user.shopDetails': {
    en: 'View Shop Details',
    es: 'Ver Detalles de Tienda',
    fr: 'Voir les Détails du Magasin',
    hi: 'दुकान का विवरण देखें',
    zh: '查看商店详情'
  },

  // Admin Dashboard
  'admin.welcome': {
    en: 'Admin Dashboard',
    es: 'Panel de Administración',
    fr: 'Tableau de Bord Admin',
    hi: 'एडमिन डैशबोर्ड',
    zh: '管理员仪表板'
  },
  'admin.createShop': {
    en: 'Create Shop',
    es: 'Crear Tienda',
    fr: 'Créer un Magasin',
    hi: 'दुकान बनाएं',
    zh: '创建商店'
  },
  'admin.manageShops': {
    en: 'Manage Shops',
    es: 'Gestionar Tiendas',
    fr: 'Gérer les Magasins',
    hi: 'दुकानों का प्रबंधन',
    zh: '管理商店'
  },
  'admin.manageOffers': {
    en: 'Manage Offers',
    es: 'Gestionar Ofertas',
    fr: 'Gérer les Offres',
    hi: 'ऑफर का प्रबंधन',
    zh: '管理优惠'
  },
  'admin.analytics': {
    en: 'Analytics Dashboard',
    es: 'Panel de Análisis',
    fr: 'Tableau de Bord Analytique',
    hi: 'एनालिटिक्स डैशबोर्ड',
    zh: '分析仪表板'
  },
  'admin.bulkUpload': {
    en: 'Bulk Upload',
    es: 'Carga Masiva',
    fr: 'Téléchargement en Lot',
    hi: 'बल्क अपलोड',
    zh: '批量上传'
  },
  'admin.expiredOffers': {
    en: 'Expired Offers',
    es: 'Ofertas Expiradas',
    fr: 'Offres Expirées',
    hi: 'समाप्त ऑफर',
    zh: '过期优惠'
  },

  // Common
  'common.loading': {
    en: 'Loading...',
    es: 'Cargando...',
    fr: 'Chargement...',
    hi: 'लोड हो रहा है...',
    zh: '加载中...'
  },
  'common.error': {
    en: 'Error',
    es: 'Error',
    fr: 'Erreur',
    hi: 'त्रुटि',
    zh: '错误'
  },
  'common.success': {
    en: 'Success',
    es: 'Éxito',
    fr: 'Succès',
    hi: 'सफलता',
    zh: '成功'
  },
  'common.save': {
    en: 'Save',
    es: 'Guardar',
    fr: 'Enregistrer',
    hi: 'सहेजें',
    zh: '保存'
  },
  'common.cancel': {
    en: 'Cancel',
    es: 'Cancelar',
    fr: 'Annuler',
    hi: 'रद्द करें',
    zh: '取消'
  },
  'common.delete': {
    en: 'Delete',
    es: 'Eliminar',
    fr: 'Supprimer',
    hi: 'हटाएं',
    zh: '删除'
  },
  'common.edit': {
    en: 'Edit',
    es: 'Editar',
    fr: 'Modifier',
    hi: 'संपादित करें',
    zh: '编辑'
  },
  'common.add': {
    en: 'Add',
    es: 'Agregar',
    fr: 'Ajouter',
    hi: 'जोड़ें',
    zh: '添加'
  },
  'common.search': {
    en: 'Search',
    es: 'Buscar',
    fr: 'Rechercher',
    hi: 'खोजें',
    zh: '搜索'
  },
  'common.filter': {
    en: 'Filter',
    es: 'Filtrar',
    fr: 'Filtrer',
    hi: 'फ़िल्टर',
    zh: '筛选'
  },
  'common.language': {
    en: 'Language',
    es: 'Idioma',
    fr: 'Langue',
    hi: 'भाषा',
    zh: '语言'
  },

  // Forms
  'form.email': {
    en: 'Email',
    es: 'Correo electrónico',
    fr: 'E-mail',
    hi: 'ईमेल',
    zh: '邮箱'
  },
  'form.password': {
    en: 'Password',
    es: 'Contraseña',
    fr: 'Mot de passe',
    hi: 'पासवर्ड',
    zh: '密码'
  },
  'form.name': {
    en: 'Name',
    es: 'Nombre',
    fr: 'Nom',
    hi: 'नाम',
    zh: '姓名'
  },
  'form.address': {
    en: 'Address',
    es: 'Dirección',
    fr: 'Adresse',
    hi: 'पता',
    zh: '地址'
  },
  'form.mobile': {
    en: 'Mobile',
    es: 'Móvil',
    fr: 'Mobile',
    hi: 'मोबाइल',
    zh: '手机'
  },
  'form.submit': {
    en: 'Submit',
    es: 'Enviar',
    fr: 'Soumettre',
    hi: 'सबमिट करें',
    zh: '提交'
  },

  // Messages
  'message.loginSuccess': {
    en: 'Login successful!',
    es: '¡Inicio de sesión exitoso!',
    fr: 'Connexion réussie !',
    hi: 'लॉगिन सफल!',
    zh: '登录成功！'
  },
  'message.loginError': {
    en: 'Login failed. Please check your credentials.',
    es: 'Error de inicio de sesión. Verifique sus credenciales.',
    fr: 'Échec de la connexion. Vérifiez vos identifiants.',
    hi: 'लॉगिन विफल। कृपया अपने क्रेडेंशियल्स जांचें।',
    zh: '登录失败。请检查您的凭据。'
  },
  'message.saveSuccess': {
    en: 'Data saved successfully!',
    es: '¡Datos guardados exitosamente!',
    fr: 'Données enregistrées avec succès !',
    hi: 'डेटा सफलतापूर्वक सहेजा गया!',
    zh: '数据保存成功！'
  },
  'message.deleteSuccess': {
    en: 'Item deleted successfully!',
    es: '¡Elemento eliminado exitosamente!',
    fr: 'Élément supprimé avec succès !',
    hi: 'आइटम सफलतापूर्वक हटा दिया गया!',
    zh: '项目删除成功！'
  }
};

export function getTranslation(key: string, language: Language): string {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  return translation[language] || translation['en'] || key;
}

export function getLanguageName(language: Language): string {
  const names = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    hi: 'हिंदी',
    zh: '中文'
  };
  return names[language] || language;
} 