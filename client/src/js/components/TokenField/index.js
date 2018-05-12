import './TokenField.css';

const TokenField = ({ token, isEditing, onSubmit, onEdit }) => (
  <div class="token-field">
    {isEditing
      ? <form onsubmit={e => {
        e.preventDefault();
        onSubmit(e.target.token.value);
      }}>
        <div class="token-field--empty">
          <input type="text" name="token"
                 value={token}
                 class="token-field__input" placeholder="Enter Bearer token..."
                 autocomplete="off" spellcheck="false"/>
        </div>
      </form>
      : <div class="token-field--filled" onclick={() => onEdit(true)}>
        Token in use
      </div>}
  </div>
);

export default TokenField;
