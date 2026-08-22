<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  initialTab: 'privacy' | 'terms'
}>()

const emit = defineEmits<{ close: [] }>()

const activeTab = ref<'privacy' | 'terms'>(props.initialTab)
</script>

<template>
  <div class="modal-backdrop" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="tab-row">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'privacy' }"
            @click="activeTab = 'privacy'"
          >Privacy Policy</button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'terms' }"
            @click="activeTab = 'terms'"
          >Terms of Service</button>
        </div>
        <button class="close-btn" @click="emit('close')" title="Close">
          <svg viewBox="0 0 24 24" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
        </button>
      </div>
      <div class="modal-body">
        <!-- Privacy Policy -->
        <div v-if="activeTab === 'privacy'" class="legal-text">
          <h2>Privacy Policy</h2>
          <p class="last-updated">Last updated: August 22, 2026</p>

          <h3>1. Overview</h3>
          <p>
            This Privacy Policy describes how the YT Video Selector app ("the App") handles data.
            The App is a client-side web application that runs entirely in your browser. It does not
            have a backend server, a database, or any server-side infrastructure.
          </p>

          <h3>2. Data We Collect</h3>
          <p>
            <strong>We collect nothing.</strong> The App does not collect, store, transmit, or process
            any personal data. There are no user accounts, no analytics, no telemetry, no tracking
            pixels, and no server-side logs. We have no access to your data at any point.
          </p>

          <h3>3. Local Storage</h3>
          <p>
            All data you create in the App — your pages, video links, custom titles, and display
            preferences — is stored exclusively in your browser's <code>localStorage</code>. This data
            never leaves your device. It is not transmitted to us or to any third party. Clearing your
            browser data will permanently delete this information. You can export your data as a JSON
            file at any time using the Export feature.
          </p>

          <h3>4. Third-Party Services: YouTube and Google</h3>
          <p>
            The App embeds videos using YouTube's official embedded player. When you click a video to
            play it, the YouTube player is loaded directly from Google's servers. This means:
          </p>
          <ul>
            <li>
              Google may set cookies on your browser when you interact with the embedded player.
            </li>
            <li>
              Google may collect data about your device, your interaction with the video, and your
              viewing activity, in accordance with their own privacy practices.
            </li>
            <li>
              The App uses YouTube's privacy-enhanced embed mode (<code>youtube-nocookie.com</code>),
              which limits some tracking, but does not eliminate it entirely.
            </li>
            <li>
              When the App fetches a video title automatically (if you do not provide a custom title),
              a request is sent directly from your browser to YouTube's public oEmbed API. No data is
              routed through us.
            </li>
          </ul>
          <p>
            We encourage you to review Google's Privacy Policy at
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              policies.google.com/privacy
            </a>
            to understand how Google handles data when you view embedded YouTube content.
          </p>

          <h3>5. Your Choices</h3>
          <p>
            You can manage or delete your locally stored data at any time by using your browser's
            settings to clear site data, or by using the App's Reset feature. You can avoid YouTube
            tracking entirely by not playing embedded videos. You can provide custom titles when adding
            videos to prevent the App from fetching titles from YouTube's API.
          </p>

          <h3>6. Children's Privacy</h3>
          <p>
            The App does not knowingly collect any data from anyone, including children. However,
            YouTube's embedded player and its services may have their own age requirements. Please
            refer to YouTube's terms for guidance.
          </p>

          <h3>7. Changes to This Policy</h3>
          <p>
            If this Privacy Policy changes, the updated version will be accessible within the App.
            Since the App is open-source under the MIT license, you can always review the source code
            to verify how data is handled.
          </p>

          <h3>8. Contact</h3>
          <p>
            This is an open-source project. Questions about this Privacy Policy can be raised via the
            project's GitHub repository issue tracker.
          </p>
        </div>

        <!-- Terms of Service -->
        <div v-if="activeTab === 'terms'" class="legal-text">
          <h2>Terms of Service</h2>
          <p class="last-updated">Last updated: August 22, 2026</p>

          <h3>1. Acceptance of Terms</h3>
          <p>
            By using the YT Video Selector app ("the App"), you agree to these Terms of Service.
            If you do not agree, do not use the App. The App is open-source software licensed under
            the MIT License.
          </p>

          <h3>2. Open-Source License</h3>
          <p>
            The App's source code is provided under the MIT License, which means it is provided
            "as is," without warranty of any kind. You are free to use, modify, and distribute the
            code in accordance with the terms of that license.
          </p>

          <h3>3. No Warranty and "As-Is" Use</h3>
          <p>
            The App is provided strictly "as is" and "as available," without any warranties of any
            kind, whether express or implied. This includes, but is not limited to, warranties of
            merchantability, fitness for a particular purpose, and non-infringement.
          </p>
          <p>
            <strong>You are solely responsible for backing up your data.</strong> Because all data is
            stored in your browser's localStorage, clearing your browser data, using private browsing
            mode, or certain browser settings may permanently delete your video collections. The App
            provides an Export feature so you can save JSON backups. We are not responsible for any
            data loss resulting from browser data clearing, browser updates, or failure to maintain
            your own backups.
          </p>

          <h3>4. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, we shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of the App.
            This includes, but is not limited to:
          </p>
          <ul>
            <li>App downtime, unavailability, or interruptions;</li>
            <li>Bugs, errors, or inaccuracies in the App;</li>
            <li>Browser incompatibility or changes in browser behavior;</li>
            <li>Loss of data stored in localStorage;</li>
            <li>Any damage to your device or loss of data resulting from the App.</li>
          </ul>
          <p>
            Since the App runs entirely in your browser and we have no server-side control over your
            instance, our liability is further limited to the maximum extent permitted by the MIT
            License under which the code is distributed.
          </p>

          <h3>5. Content Disclaimer</h3>
          <p>
            The App does not host, store, own, or control any video content. Users save public YouTube
            links locally in their browsers. All video content remains the property of its respective
            owners and is served by YouTube. We do not endorse, verify, or take responsibility for
            any content that users choose to link to. The App is a tool for organizing links; it is
            not a content provider.
          </p>

          <h3>6. YouTube Terms of Service</h3>
          <p>
            By using this App to view YouTube videos, you acknowledge that you are also bound by
            YouTube's Terms of Service and Google's Terms of Service. You are responsible for
            ensuring that your use of YouTube content complies with their terms. The App's use of
            YouTube's embedded player is intended to comply with YouTube's API and embed policies.
            Please review YouTube's Terms at
            <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">
              youtube.com/t/terms
            </a>
            and Google's Terms at
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
              policies.google.com/terms
            </a>.
          </p>

          <h3>7. User Responsibilities</h3>
          <p>
            You are responsible for the links you save and the content you choose to view. You agree
            not to use the App to organize or access content that is illegal in your jurisdiction or
            that violates any applicable laws or third-party rights.
          </p>

          <h3>8. No Accounts and No Tracking</h3>
          <p>
            The App does not require user accounts and does not track, identify, or profile users.
            There is no authentication, no telemetry, and no analytics. Your use of the App is
            anonymous from our perspective.
          </p>

          <h3>9. Changes to These Terms</h3>
          <p>
            These Terms may be updated in future versions of the App. Since the App is open-source,
            you can review the source code at any time. Continued use of the App after changes
            constitutes acceptance of the updated Terms.
          </p>

          <h3>10. Governing Law</h3>
          <p>
            These Terms are governed by the MIT License and applicable law. Any disputes shall be
            resolved in accordance with the license terms and your local jurisdiction.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.modal-content {
  background: var(--surface);
  border-radius: 12px;
  width: 100%;
  max-width: 720px;
  max-height: 85vh;
  overflow: hidden;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.25s ease;
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.tab-row {
  display: flex;
  gap: 4px;
}
.tab-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-muted);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.tab-btn.active {
  border-color: var(--accent);
  background: var(--accent-bg);
  color: var(--accent);
}
.tab-btn:hover:not(.active) {
  border-color: var(--text-muted);
  color: var(--text);
}
.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;
}
.close-btn:hover {
  background: var(--surface-hover);
  color: var(--text);
}
.close-btn svg {
  fill: currentColor;
}
.modal-body {
  padding: 24px 28px;
  overflow-y: auto;
  flex: 1;
}
.legal-text h2 {
  margin: 0 0 4px;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
}
.legal-text h3 {
  margin: 24px 0 8px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
}
.legal-text p {
  margin: 0 0 12px;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text);
}
.legal-text ul {
  margin: 0 0 12px;
  padding-left: 20px;
}
.legal-text ul li {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text);
  margin-bottom: 4px;
}
.legal-text a {
  color: var(--accent);
  text-decoration: none;
}
.legal-text a:hover {
  text-decoration: underline;
}
.legal-text code {
  background: var(--surface-hover);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8125rem;
  color: var(--text);
}
.last-updated {
  font-size: 0.8125rem !important;
  color: var(--text-muted);
  margin-bottom: 16px !important;
}
</style>
