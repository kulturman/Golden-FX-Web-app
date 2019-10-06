const createUserMenu = user => {console.log('usessr' , user)
    const menu = [
        {
            label: "Tableau de bord",
            icon: "fa fa-fw fa-home",
            to: "/tableau-de-bord"
        }
    ];

    const fundSubmenu = {
        label: "Le fonds",
        icon: "fa fa-fw fa-money",
        items: [
            {
                label: "Historique évolution journlière",
                to: "/historique-evolution"
            }
        ]
    };

    const UsersSubmenu = {
        label: "Gestion des utilisateurs",
        icon: "fa fa-fw fa-users",
        items: [
            { label: "Liste des utilisateurs", to: "/utilisateurs" },
            { label: "Liste d'attente", to: "/liste-d-attente" },
            { label: "Ajouter un utilisateur", to: "/nouvel-utilisateur" }
        ]
    };

    const operationsSubmenu = {
        label: "Opérations",
        icon: "fa fa-fw fa-bars",
        items: [
            {
                label: "Toutes les demandes de retraits",
                to: "/tous-les-retraits"
            }
        ]
    }

    if (user) {
        if (user.isAdmin) {
            menu.push(UsersSubmenu);

            fundSubmenu.items.push({
                label: "Ajouter l'évolution du jour",
                to: "/ajouter-evolution-journalière"
            });
            operationsSubmenu.items.push({
                label: "Demandes de retrait en attente",
                to: "/retraits-en-attente"
            })
        } else {
            fundSubmenu.items.push({
                label: "Historique de vos gains / pertes",
                to: "/historique-evolution-client"
            });
            operationsSubmenu.items.push({
                label: "Historique de vos retraits",
                to: "/mes-retraits"
            });
            operationsSubmenu.items.push({
                label: "Faire une demande de retrait",
                to: "/nouveau-retrait"
            });
        }
       
    }
    if(user.isAdmin) {
        return [
            {
                label: "Tableau de bord",
                icon: "fa fa-fw fa-home",
                to: "/tableau-de-bord"
            }
        ]
    }
    return [
        {
            label: "Tableau de bord",
            icon: "fa fa-fw fa-home",
            to: "/tableau-de-bord"
        }
    ]
}

export { createUserMenu };