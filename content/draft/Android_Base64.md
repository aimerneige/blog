Base64

```kotlin
import android.util.Base64

val charset = Charsets.UTF_8

val source_string = "Hello AimerNeige!"

val b64_ret = Base64.encode(source_string.toByteArray(charset), Base64.DEFAULT).toString(charset)
```