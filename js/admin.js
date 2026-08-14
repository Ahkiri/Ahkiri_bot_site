async function connexionAdmin(email, motDePasse) {

    const { data, error } =
        await clientSupabase.auth.signInWithPassword({
            email: email.trim(),
            password: motDePasse
        });

    if (error) {
        console.error("Erreur Supabase :", error);

        alert(
            "Connexion impossible\n\n" +
            "Message : " + error.message
        );

        return;
    }

    console.log("Utilisateur connecté :", data.user);

    document.getElementById("connexion").style.display = "none";
    document.getElementById("zone-admin").style.display = "block";
}

const boutonPublierVideo =
    document.getElementById("publier-video");

const messageVideo =
    document.getElementById("message-video");


boutonPublierVideo.addEventListener(
    "click",
    async function () {

        const titre =
            document
                .getElementById("titre-video")
                .value
                .trim();

        const description =
            document
                .getElementById("description-video")
                .value
                .trim();

        const fichierInput =
            document.getElementById("fichier-video");

        const fichier =
            fichierInput.files[0];


        /* =========================
           VÉRIFICATIONS
        ========================= */

        if (!titre) {

            afficherMessageVideo(
                "Ajoute un titre.",
                "erreur"
            );

            return;
        }


        if (!fichier) {

            afficherMessageVideo(
                "Choisis une vidéo.",
                "erreur"
            );

            return;
        }


        if (!fichier.type.startsWith("video/")) {

            afficherMessageVideo(
                "Le fichier sélectionné n'est pas une vidéo.",
                "erreur"
            );

            return;
        }


        afficherMessageVideo(
            "Envoi de la vidéo...",
            "information"
        );


        boutonPublierVideo.disabled = true;


        try {

            /* =========================
               NOM UNIQUE
            ========================= */

            const extension =
                fichier.name
                    .split(".")
                    .pop();

            const nomFichier =
                Date.now()
                + "-"
                + crypto.randomUUID()
                + "."
                + extension;


            /* =========================
               ENVOI DANS STORAGE
            ========================= */

            const {
                data: donneesUpload,
                error: erreurUpload
            } =
                await clientSupabase
                    .storage
                    .from("videos")
                    .upload(
                        nomFichier,
                        fichier,
                        {
                            cacheControl: "3600",
                            upsert: false
                        }
                    );


            if (erreurUpload) {

                throw erreurUpload;

            }


            /* =========================
               RÉCUPÉRATION URL PUBLIQUE
            ========================= */

            const {
                data: donneesUrl
            } =
                clientSupabase
                    .storage
                    .from("videos")
                    .getPublicUrl(
                        donneesUpload.path
                    );


            const urlVideo =
                donneesUrl.publicUrl;


            /* =========================
               ENREGISTREMENT BDD
            ========================= */

            const {
                error: erreurBDD
            } =
                await clientSupabase
                    .from("videos")
                    .insert({

                        titre: titre,

                        description:
                            description,

                        url_video:
                            urlVideo,

                        nom_fichier:
                            donneesUpload.path

                    });


            if (erreurBDD) {

                throw erreurBDD;

            }


            /* =========================
               SUCCÈS
            ========================= */

            afficherMessageVideo(
                "✅ Vidéo publiée avec succès.",
                "succes"
            );


            document
                .getElementById("titre-video")
                .value = "";

            document
                .getElementById("description-video")
                .value = "";

            fichierInput.value = "";


            chargerVideosAdmin();


            /* Recharge l'aperçu du site */

            const iframe =
                document.querySelector(
                    ".cadre-site iframe"
                );

            if (iframe) {

                iframe.src =
                    iframe.src;

            }

        }

        catch (erreur) {

            console.error(
                "Erreur publication vidéo :",
                erreur
            );


            afficherMessageVideo(
                "❌ Impossible de publier : "
                + erreur.message,
                "erreur"
            );

        }

        finally {

            boutonPublierVideo.disabled =
                false;

        }

    }
);


/* =========================================
   MESSAGE
========================================= */

function afficherMessageVideo(
    message,
    type
) {

    messageVideo.textContent =
        message;


    if (type === "succes") {

        messageVideo.style.color =
            "#56ff87";

    }

    else if (type === "erreur") {

        messageVideo.style.color =
            "#ff5c74";

    }

    else {

        messageVideo.style.color =
            "#c06cff";

    }

}


/* =========================================
   CHARGER LES VIDÉOS
========================================= */

async function chargerVideosAdmin() {

    const liste =
        document.getElementById(
            "liste-videos-admin"
        );


    const {
        data: videos,
        error
    } =
        await clientSupabase
            .from("videos")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Erreur chargement vidéos :",
            error
        );

        return;

    }


    liste.innerHTML = "";


    if (!videos || videos.length === 0) {

        liste.innerHTML =
            "<p>Aucune vidéo publiée.</p>";

        return;

    }


    videos.forEach(
        function (video) {

            const carte =
                document.createElement(
                    "article"
                );


            carte.style.background =
                "#09091a";

            carte.style.border =
                "1px solid #292947";

            carte.style.borderRadius =
                "12px";

            carte.style.overflow =
                "hidden";


            carte.innerHTML = `

                <video
                    controls
                    preload="metadata"
                    style="
                        width:100%;
                        aspect-ratio:16/9;
                        background:black;
                    "
                >

                    <source
                        src="${video.url_video}"
                        type="video/mp4"
                    >

                </video>

                <div
                    style="padding:15px;"
                >

                    <h4>
                        ${video.titre}
                    </h4>

                    <p>
                        ${video.description || ""}
                    </p>

                </div>

            `;


            liste.appendChild(
                carte
            );

        }
    );

}


/* =========================================
   CHARGEMENT INITIAL
========================================= */

chargerVideosAdmin();
